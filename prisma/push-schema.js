require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

const HOSTNAME = 'ep-dark-surf-aplhdrqi-pooler.c-7.us-east-1.aws.neon.tech';

async function pushSchema() {
  // Resolve IPv4 first (workaround for IPv6 DNS issues)
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

  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  
  try {
    await pool.query(schema);
    console.log('✅ Schema pushed successfully');
  } catch (err) {
    console.error('❌ Schema push failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

pushSchema();
