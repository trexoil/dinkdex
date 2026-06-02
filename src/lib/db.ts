import { Pool } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (pool) return pool
  const connStr = process.env.DATABASE_URL
  if (!connStr) throw new Error('DATABASE_URL is not set')
  pool = new Pool({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
    idleTimeoutMillis: 30000,
    max: 3,
  })
  return pool
}

export async function query(text: string, params?: any[]) {
  const p = getPool()
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
  const result = await query(`SELECT * FROM courts c ${where} ORDER BY c.is_premium DESC, c.created_at DESC ${limitClause}`, params)
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
  const result = await query(`SELECT co.*, COALESCE(json_agg(json_build_object('id',c.id,'name',c.name,'slug',c.slug)) FILTER (WHERE c.id IS NOT NULL), '[]'::json) as courts FROM coaches co LEFT JOIN coach_courts cc ON co.id = cc.coach_id LEFT JOIN courts c ON cc.court_id = c.id ${where} GROUP BY co.id ORDER BY co.is_premium DESC, co.created_at DESC ${limitClause}`, params)
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

export async function getCityCourtCounts(cities: string[]) {
  if (!cities.length) return {}
  const placeholders = cities.map((_, i) => `$${i + 1}`).join(', ')
  const result = await query(
    `SELECT city, COUNT(*)::int as count FROM courts WHERE city = ANY(ARRAY[${placeholders}]) GROUP BY city`,
    cities
  )
  const counts: Record<string, number> = {}
  result.rows.forEach((r: any) => { counts[r.city] = parseInt(r.count, 10) })
  cities.forEach(c => { if (!counts[c]) counts[c] = 0 })
  return counts
}

export async function createLead(data: { email: string; name?: string; type?: string; message?: string }) {
  const r = await query('INSERT INTO leads (email,name,type,message) VALUES ($1,$2,$3,$4) RETURNING id', [data.email, data.name||null, data.type||'newsletter', data.message||null])
  return r.rows[0]
}

export async function createSubmission(data: { name: string; email: string; courtName?: string; courtAddress?: string; message?: string }) {
  const r = await query('INSERT INTO submissions (name,email,listing_name,listing_address,message) VALUES ($1,$2,$3,$4,$5) RETURNING id', [data.name, data.email, data.courtName||null, data.courtAddress||null, data.message||null])
  return r.rows[0]
}
