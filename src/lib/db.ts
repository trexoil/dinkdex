import { Pool } from 'pg'
import * as dns from 'dns'

const HOSTNAME = 'ep-dark-surf-aplhdrqi-pooler.c-7.us-east-1.aws.neon.tech'

async function resolveHost(): Promise<string | null> {
  try {
    const addrs = await new Promise<string[]>((resolve, reject) => {
      dns.resolve4(HOSTNAME, (err, addrs) => {
        if (err || !addrs.length) reject(err || new Error('No IPv4'))
        else resolve(addrs)
      })
    })
    return addrs[0]
  } catch {
    return null
  }
}

let pool: Pool | null = null

async function getPool(): Promise<Pool> {
  if (pool) return pool
  const connStr = process.env.DATABASE_URL
  if (!connStr) throw new Error('DATABASE_URL is not set')

  const url = new URL(connStr)

  // Try direct connection first (works on Vercel)
  // Fall back to IPv4 workaround (needed on some local servers)
  const ipv4 = await resolveHost()

  pool = new Pool({
    host: ipv4 || HOSTNAME,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    port: parseInt(url.port || '5432'),
    ssl: { rejectUnauthorized: false, servername: HOSTNAME },
    connectionTimeoutMillis: 20000,
    idleTimeoutMillis: 30000,
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

export async function getCourtCounts() {
  const result = await query('SELECT COUNT(*) as total FROM courts')
  const total = parseInt(result.rows[0].total, 10)
  const countriesResult = await query('SELECT COUNT(DISTINCT country) as total FROM courts')
  const countries = parseInt(countriesResult.rows[0].total, 10)
  const coachesResult = await query('SELECT COUNT(*) as total FROM coaches')
  const coaches = parseInt(coachesResult.rows[0].total, 10)
  return { courts: total, countries, coaches }
}

export async function getAllCourts({
  search, city, indoor, featured, limit, offset,
}: {
  search?: string; city?: string; indoor?: boolean; featured?: boolean; limit?: number; offset?: number
} = {}) {
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1
  if (city) { conditions.push(`c.city ILIKE $${paramIndex}`); params.push(`%${city}%`); paramIndex++ }
  if (indoor !== undefined) { conditions.push(`c.indoor = $${paramIndex}`); params.push(indoor); paramIndex++ }
  if (featured) { conditions.push(`c.is_premium = true`) }
  if (search) { conditions.push(`(c.name ILIKE $${paramIndex} OR c.address ILIKE $${paramIndex} OR c.city ILIKE $${paramIndex})`); params.push(`%${search}%`); paramIndex++ }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitClause = limit ? `LIMIT $${paramIndex}` : ''
  if (limit) { params.push(limit); paramIndex++ }
  const offsetClause = offset ? `OFFSET $${paramIndex}` : ''
  if (offset) { params.push(offset); paramIndex++ }
  const result = await query(`SELECT * FROM courts c ${where} ORDER BY c.is_premium DESC, c.created_at DESC ${limitClause} ${offsetClause}`, params)
  return result.rows
}

export async function getCourtBySlug(slug: string) {
  const result = await query('SELECT * FROM courts WHERE slug = $1', [slug])
  return result.rows[0] || null
}

export async function getAllCoaches({ search, city, featured, limit, offset }: {
  search?: string; city?: string; featured?: boolean; limit?: number; offset?: number
} = {}) {
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1
  if (city) { conditions.push(`co.city ILIKE $${paramIndex}`); params.push(`%${city}%`); paramIndex++ }
  if (featured) { conditions.push(`co.is_premium = true`) }
  if (search) { conditions.push(`(co.name ILIKE $${paramIndex} OR co.bio ILIKE $${paramIndex} OR co.city ILIKE $${paramIndex})`); params.push(`%${search}%`); paramIndex++ }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitClause = limit ? `LIMIT $${paramIndex}` : ''
  if (limit) { params.push(limit); paramIndex++ }
  const offsetClause = offset ? `OFFSET $${paramIndex}` : ''
  if (offset) { params.push(offset); paramIndex++ }
  const result = await query(`SELECT co.*, COALESCE(json_agg(json_build_object('id',c.id,'name',c.name,'slug',c.slug)) FILTER (WHERE c.id IS NOT NULL), '[]'::json) as courts FROM coaches co LEFT JOIN coach_courts cc ON co.id = cc.coach_id LEFT JOIN courts c ON cc.court_id = c.id ${where} GROUP BY co.id ORDER BY co.is_premium DESC, co.created_at DESC ${limitClause} ${offsetClause}`, params)
  return result.rows
}

export async function getCoachBySlug(slug: string) {
  const result = await query(`SELECT co.*, COALESCE(json_agg(json_build_object('id',c.id,'name',c.name,'slug',c.slug)) FILTER (WHERE c.id IS NOT NULL), '[]'::json) as courts FROM coaches co LEFT JOIN coach_courts cc ON co.id = cc.coach_id LEFT JOIN courts c ON cc.court_id = c.id WHERE co.slug = $1 GROUP BY co.id`, [slug])
  return result.rows[0] || null
}

export async function getCities() {
  const result = await query('SELECT DISTINCT city FROM courts WHERE city IS NOT NULL ORDER BY city')
  return result.rows
}

export async function getFeaturedCourts(limit = 6) {
  return getAllCourts({ featured: true, limit })
}

export async function getFeaturedCoaches(limit = 6) {
  return getAllCoaches({ featured: true, limit })
}

export async function createLead(data: { email: string; name?: string; type?: string; message?: string }) {
  const r = await query('INSERT INTO leads (email,name,type,message) VALUES ($1,$2,$3,$4) RETURNING id', [data.email, data.name||null, data.type||'newsletter', data.message||null])
  return r.rows[0]
}

export async function createSubmission(data: { name: string; email: string; courtName?: string; courtAddress?: string; message?: string }) {
  const r = await query('INSERT INTO submissions (name,email,listing_name,listing_address,message) VALUES ($1,$2,$3,$4,$5) RETURNING id', [data.name, data.email, data.courtName||null, data.courtAddress||null, data.message||null])
  return r.rows[0]
}
