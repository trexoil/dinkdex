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
let poolInit: Promise<void> | null = null

async function getPool(): Promise<Pool> {
  if (pool) return pool
  if (!poolInit) {
    poolInit = (async () => {
      const ipv4 = await resolveHost()
      pool = new Pool({
        host: ipv4,
        database: 'neondb',
        user: 'neondb_owner',
        password: 'npg_6HNsvG1qZRSA',
        port: 5432,
        ssl: {
          rejectUnauthorized: false,
          servername: HOSTNAME,
        },
        connectionTimeoutMillis: 10000,
      })
    })()
  }
  await poolInit
  return pool!
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
  city,
  country,
  indoor,
  featured,
  search,
  limit,
  offset,
}: {
  city?: string
  country?: string
  indoor?: boolean
  featured?: boolean
  search?: string
  limit?: number
  offset?: number
} = {}) {
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (city) { conditions.push(`c.city ILIKE $${paramIndex}`); params.push(`%${city}%`); paramIndex++ }
  if (country) { conditions.push(`c.country ILIKE $${paramIndex}`); params.push(`%${country}%`); paramIndex++ }
  if (indoor !== undefined) { conditions.push(`c.indoor = $${paramIndex}`); params.push(indoor); paramIndex++ }
  if (featured) { conditions.push(`c.is_premium = true`); }
  if (search) { conditions.push(`(c.name ILIKE $${paramIndex} OR c.address ILIKE $${paramIndex} OR c.city ILIKE $${paramIndex})`); params.push(`%${search}%`); paramIndex++ }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitClause = limit ? `LIMIT $${paramIndex}` : ''
  if (limit) { params.push(limit); paramIndex++ }
  const offsetClause = offset ? `OFFSET $${paramIndex}` : ''
  if (offset) { params.push(offset); paramIndex++ }

  const sql = `
    SELECT * FROM courts c
    ${where}
    ORDER BY c.is_premium DESC, c.created_at DESC
    ${limitClause} ${offsetClause}
  `
  const result = await query(sql, params)
  return result.rows
}

export async function getCourtBySlug(slug: string) {
  const result = await query('SELECT * FROM courts WHERE slug = $1', [slug])
  return result.rows[0] || null
}

export async function getCourtById(id: number) {
  const result = await query('SELECT * FROM courts WHERE id = $1', [id])
  return result.rows[0] || null
}

export async function getAllCoaches({
  city,
  country,
  search,
  featured,
  limit,
  offset,
}: {
  city?: string
  country?: string
  search?: string
  featured?: boolean
  limit?: number
  offset?: number
} = {}) {
  const conditions: string[] = []
  const params: any[] = []
  let paramIndex = 1

  if (city) { conditions.push(`co.city ILIKE $${paramIndex}`); params.push(`%${city}%`); paramIndex++ }
  if (country) { conditions.push(`co.country ILIKE $${paramIndex}`); params.push(`%${country}%`); paramIndex++ }
  if (featured) { conditions.push(`co.is_premium = true`); }
  if (search) { conditions.push(`(co.name ILIKE $${paramIndex} OR co.bio ILIKE $${paramIndex} OR co.city ILIKE $${paramIndex})`); params.push(`%${search}%`); paramIndex++ }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''
  const limitClause = limit ? `LIMIT $${paramIndex}` : ''
  if (limit) { params.push(limit); paramIndex++ }
  const offsetClause = offset ? `OFFSET $${paramIndex}` : ''
  if (offset) { params.push(offset); paramIndex++ }

  const sql = `
    SELECT co.*, 
      COALESCE(
        json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) 
        FILTER (WHERE c.id IS NOT NULL), 
        '[]'::json
      ) as courts
    FROM coaches co
    LEFT JOIN coach_courts cc ON co.id = cc.coach_id
    LEFT JOIN courts c ON cc.court_id = c.id
    ${where}
    GROUP BY co.id
    ORDER BY co.is_premium DESC, co.created_at DESC
    ${limitClause} ${offsetClause}
  `
  const result = await query(sql, params)
  return result.rows
}

export async function getCoachBySlug(slug: string) {
  const result = await query(`
    SELECT co.*, 
      COALESCE(
        json_agg(json_build_object('id', c.id, 'name', c.name, 'slug', c.slug)) 
        FILTER (WHERE c.id IS NOT NULL), 
        '[]'::json
      ) as courts
    FROM coaches co
    LEFT JOIN coach_courts cc ON co.id = cc.coach_id
    LEFT JOIN courts c ON cc.court_id = c.id
    WHERE co.slug = $1
    GROUP BY co.id
  `, [slug])
  return result.rows[0] || null
}

export async function getCities() {
  const result = await query(`
    SELECT DISTINCT city, country FROM courts WHERE city IS NOT NULL ORDER BY country, city
  `)
  return result.rows
}

export async function getFeaturedCourts(limit = 6) {
  return getAllCourts({ featured: true, limit })
}

export async function getFeaturedCoaches(limit = 6) {
  return getAllCoaches({ featured: true, limit })
}

export async function createLead(data: { email: string; name?: string; type?: string; message?: string }) {
  const result = await query(
    `INSERT INTO leads (email, name, type, message) VALUES ($1, $2, $3, $4) RETURNING id`,
    [data.email, data.name || null, data.type || 'newsletter', data.message || null]
  )
  return result.rows[0]
}

export async function createSubmission(data: { name: string; email: string; courtName?: string; courtAddress?: string; message?: string }) {
  const result = await query(
    `INSERT INTO submissions (name, email, listing_name, listing_address, message) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [data.name, data.email, data.courtName || null, data.courtAddress || null, data.message || null]
  )
  return result.rows[0]
}
