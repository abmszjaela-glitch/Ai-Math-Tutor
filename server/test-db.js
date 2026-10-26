require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000,
});

client.connect()
  .then(() => client.query('SELECT 1'))
  .then(() => { console.log('DB OK'); return client.end(); })
  .catch(e => { console.error('DB FAIL:', e.code, e.message); process.exit(1); });