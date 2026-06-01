require('dotenv').config({ path: '.env' });
const { Pool } = require('pg');
const dns = require('dns');
const fs = require('fs');
const path = require('path');

const HOSTNAME = 'ep-dark-surf-aplhdrqi-pooler.c-7.us-east-1.aws.neon.tech';

async function resolveHost() {
  return new Promise((resolve, reject) => {
    dns.resolve4(HOSTNAME, (err, addrs) => {
      if (err || !addrs.length) reject(err || new Error('No IPv4 addresses'));
      else resolve(addrs[0]);
    });
  });
}

async function pushSchema() {
  const connStr = process.env.DATABASE_URL;
  if (!connStr) {
    console.error('❌ DATABASE_URL is not set in environment');
    process.exit(1);
  }

  const url = new URL(connStr);
  const ipv4 = await resolveHost();

  const pool = new Pool({
    host: ipv4,
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    port: parseInt(url.port || '5432'),
    ssl: { rejectUnauthorized: false, servername: url.hostname },
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
