import { Pool } from 'pg'
import * as dns from 'dns'

const HOSTNAME = 'ep-dark-surf-aplhdrqi-pooler.c-7.us-east-1.aws.neon.tech'

async function resolveHost(): Promise<string> {
  return new Promise((resolve, reject) => {
    dns.resolve4(HOSTNAME, (err, addrs) => {
      if (err || !addrs.length) reject(err || new Error('No IPv4 addresses'))
      else resolve(addrs[0])
    })
  })
}

let pool: Pool | null = null

async function getPool(): Promise<Pool> {
  if (pool) return pool
  const connStr = process.env.DATABASE_URL
  if (!connStr) throw new Error('DATABASE_URL is not set')
  // Parse connection parts from the Neon URL
  const url = new URL(connStr)
  const ipv4 = await resolveHost()
  pool = new Pool({
    host: ipv4,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    port: parseInt(url.port || '5432'),
    ssl: { rejectUnauthorized: false, servername: url.hostname },
    connectionTimeoutMillis: 10000,
  })
  return pool
}

export async function query(text: string, params?: any[]) {
  const p = await getPool()
  const client = await p.connect()
  try {
    const result = await client.query(text, params)
    return result
  } finally {
    client.release()
  }
}

export async function getAllCourts({
  city, country, indoor, featured, search, limit, offset,
}: {
  city?: string; country?: string; indoor?: boolean; featured?: boolean;
  search?: string; limit?: number; offset?: number;
} = {}) {
  const conditions: string[] = []
  const params: any[] = []
  let i = 1
  if (city) { conditions.push(`c.city ILIKE $${i}`); params.push(`%${city}%`); i++ }
  if (country) { conditions.push(`c.country ILIKE $${i}`); params.push(`%${country}%`); i++ }
  if (indoor !== undefined) { conditions.push(`c.indoor = $${i}`); params.push(indoor); i++ }
  if (featured) { conditions.push(`c.is_premium = true`) }
  if (search) { conditions.push(`(c.name ILIKE $${i} OR c.city ILIKE $${i})`); params.push(`%${search}%`); i++ }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  if (limit) { conditions.push(`LIMIT $${i}`); params.push(limit); i++ } else { conditions.push('LIMIT 50') }
  if (offset) { conditions.push(`OFFSET $${i}`); params.push(offset); i++ }

  // Rebuild SQL properly
  const whereClause = conditions.filter(c => !c.startsWith('LIMIT') && !c.startsWith('OFFSET')).length
    ? `WHERE ${conditions.filter(c => !c.startsWith('LIMIT') && !c.startsWith('OFFSET')).join(' AND ')}`
    : ''
  const limitClause = limit ? `LIMIT $${params.length - (offset ? 1 : 0)}` : 'LIMIT 50'
  const offsetClause = offset ? `OFFSET $${params.length}` : ''

  const sql = `SELECT * FROM courts c ${whereClause} ORDER BY c.is_premium DESC, c.created_at DESC ${limitClause} ${offsetClause}`
  const result = await query(sql, params)
  return result.rows
}

export async function getCourtBySlug(slug: string) {
  const result = await query('SELECT * FROM courts WHERE slug = $1', [slug])
  return result.rows[0] || null
}

export async function getAllCoaches({
  city, country, search, featured, limit, offset,
}: {
  city?: string; country?: string; search?: string; featured?: boolean;
  limit?: number; offset?: number;
} = {}) {
  const conditions: string[] = []
  const params: any[] = []
  let i = 1
  if (city) { conditions.push(`co.city ILIKE $${i}`); params.push(`%${city}%`); i++ }
  if (country) { conditions.push(`co.country ILIKE $${i}`); params.push(`%${country}%`); i++ }
  if (featured) { conditions.push(`co.is_premium = true`) }
  if (search) { conditions.push(`(co.name ILIKE $${i} OR co.city ILIKE $${i})`); params.push(`%${search}%`); i++ }
  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitVal = limit || 50
  params.push(limitVal); const li = params.length
  if (offset) { params.push(offset) }

  const sql = `SELECT co.*, COALESCE(json_agg(json_build_object('id',c.id,'name',c.name,'slug',c.slug)) FILTER (WHERE c.id IS NOT NULL), '[]'::json) as courts FROM coaches co LEFT JOIN coach_courts cc ON co.id=cc.coach_id LEFT JOIN courts c ON cc.court_id=c.id ${whereClause} GROUP BY co.id ORDER BY co.is_premium DESC, co.created_at DESC LIMIT $${li}${offset ? ` OFFSET $${li+1}` : ''}`
  const result = await query(sql, params)
  return result.rows
}

export async function getCoachBySlug(slug: string) {
  const result = await query(`SELECT co.*, COALESCE(json_agg(json_build_object('id',c.id,'name',c.name,'slug',c.slug)) FILTER (WHERE c.id IS NOT NULL), '[]'::json) as courts FROM coaches co LEFT JOIN coach_courts cc ON co.id=cc.coach_id LEFT JOIN courts c ON cc.court_id=c.id WHERE co.slug=$1 GROUP BY co.id`, [slug])
  return result.rows[0] || null
}

export async function getCities() {
  const result = await query('SELECT DISTINCT city, country FROM courts WHERE city IS NOT NULL ORDER BY country, city')
  return result.rows
}

export async function getFeaturedCourts(limit = 6) {
  return getAllCourts({ featured: true, limit })
}

export async function getFeaturedCoaches(limit = 6) {
  return getAllCoaches({ featured: true, limit })
}

export async function getCourtCounts() {
  const result = await query('SELECT COUNT(*) as total FROM courts')
  const total = parseInt(result.rows[0].total, 10)

  const countriesResult = await query('SELECT COUNT(DISTINCT country) as total FROM courts')
  const countries = parseInt(countriesResult.rows[0].total, 10)

  const coachesResult = await query('SELECT COUNT(*) as total FROM coaches')
  const coaches = parseInt(coachesResult.rows[0].total, 10)

  return { courts: total, countries, coaches }
}

export async function createLead(data: { email: string; name?: string; type?: string; message?: string }) {
  const r = await query('INSERT INTO leads (email,name,type,message) VALUES ($1,$2,$3,$4) RETURNING id', [data.email, data.name||null, data.type||'newsletter', data.message||null])
  return r.rows[0]
}

export async function createSubmission(data: { name: string; email: string; courtName?: string; courtAddress?: string; message?: string }) {
  const r = await query('INSERT INTO submissions (name,email,listing_name,listing_address,message) VALUES ($1,$2,$3,$4,$5) RETURNING id', [data.name, data.email, data.courtName||null, data.courtAddress||null, data.message||null])
  return r.rows[0]
}
