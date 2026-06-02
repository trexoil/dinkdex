require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const dns = require('dns');
const { courts } = require('./courts-seed');
const { coaches } = require('./coaches-seed');

const HOSTNAME = 'ep-dark-surf-aplhdrqi-pooler.c-7.us-east-1.aws.neon.tech';

async function seed() {
  const ipv4 = await new Promise((resolve, reject) => {
    dns.resolve4(HOSTNAME, (err, addrs) => {
      if (err || !addrs.length) reject(err || new Error('No IPv4 addresses'))
      else resolve(addrs[0])
    })
  });

  const pool = new Pool({
    host: ipv4,
    database: 'neondb',
    user: 'neondb_owner',
    password: 'npg_VsGC4LqZY9iS',
    port: 5432,
    ssl: { rejectUnauthorized: false, servername: HOSTNAME },
    connectionTimeoutMillis: 10000,
  });

  console.log('🌱 Seeding DinkDex database...\n');

  await pool.query('DELETE FROM coach_courts');
  await pool.query('DELETE FROM tournaments');
  await pool.query('DELETE FROM coaches');
  await pool.query('DELETE FROM courts');
  console.log('  🧹 Cleared existing data');

  console.log(`  🏟️  Seeding ${courts.length} courts...`);
  for (const court of courts) {
    await pool.query(
      `INSERT INTO courts (name, slug, address, city, state, country, lat, lng, indoor, court_count, has_lights, surface_type, amenities, phone, website, description, is_premium, verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        court.name, court.slug, court.address, court.city, court.state, court.country,
        court.lat || null, court.lng || null,
        court.indoor || false, court.court_count || 1, court.has_lights || false,
        court.surface_type || null, JSON.stringify(court.amenities || []),
        court.phone || null, court.website || null, court.description || null,
        court.is_premium || false, court.verified || false,
      ]
    );
  }

  console.log(`  🎾 Seeding ${coaches.length} coaches...`);
  for (const coach of coaches) {
    await pool.query(
      `INSERT INTO coaches (name, slug, bio, certifications, experience_years, hourly_rate, city, state, country, phone, email, website, is_premium, verified)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        coach.name, coach.slug, coach.bio, JSON.stringify(coach.certifications || []),
        coach.experience_years || 0, coach.hourly_rate || null,
        coach.city, coach.state, coach.country,
        coach.phone || null, coach.email || null, coach.website || null,
        coach.is_premium || false, coach.verified || false,
      ]
    );
  }

  console.log('  🔗 Linking coaches to courts...');
  const links = [
    ['coach-hafiz-rahman', 'kenanga-city-pickleball-stadium'],
    ['coach-sarah-lim', 'pickleball-hub-mont-kiara'],
    ['coach-wilson-ng', 'kenanga-city-pickleball-stadium'],
    ['coach-wilson-ng', 'pickleball-hub-mont-kiara'],
    ['coach-azman-yusof', 'kuching-pickleball-centre'],
    ['coach-priya-devi', 'penang-pickleball-arena'],
    ['coach-jason-tan', 'jb-pickleball-club'],
    ['coach-marcus-tan', 'singapore-pickleball-kallang'],
    ['coach-dave-pickle-pro', 'venice-beach-pickleball'],
  ];

  for (const [coachSlug, courtSlug] of links) {
    await pool.query(
      `INSERT INTO coach_courts (coach_id, court_id)
       SELECT co.id, c.id FROM coaches co, courts c
       WHERE co.slug = $1 AND c.slug = $2
       ON CONFLICT DO NOTHING`,
      [coachSlug, courtSlug]
    );
  }

  console.log(`\n✅ Seed complete! ${courts.length} courts, ${coaches.length} coaches, ${links.length} links\n`);
  await pool.end();
}

seed();
