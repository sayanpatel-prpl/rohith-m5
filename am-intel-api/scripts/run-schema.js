/**
 * Execute the database schema DDL against Supabase PostgreSQL.
 *
 * Requires DATABASE_URL in .env pointing to the Supabase direct connection:
 *   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.jkcllmniaovaswzjjbai.supabase.co:5432/postgres
 *
 * Get the password from: Supabase Dashboard → Project Settings → Database → Connection string
 *
 * Usage: node scripts/run-schema.js
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SQL_PATH = resolve(__dirname, '../migrations/001_create_schema.sql');

async function main() {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('\nERROR: DATABASE_URL not set in .env');
    console.error('\nTo get your Supabase database URL:');
    console.error('  1. Go to https://supabase.com/dashboard/project/jkcllmniaovaswzjjbai/settings/database');
    console.error('  2. Copy the "Direct connection" URI');
    console.error('  3. Add it to am-intel-api/.env as DATABASE_URL=...\n');
    process.exit(1);
  }

  console.log('\n=== Running Schema DDL ===\n');

  const sql = readFileSync(SQL_PATH, 'utf-8');
  console.log(`  SQL file: ${SQL_PATH}`);
  console.log(`  Size: ${(sql.length / 1024).toFixed(1)} KB\n`);

  const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('  Connected to database.\n');

    await client.query(sql);
    console.log('  Schema DDL executed successfully.\n');

    // Verify tables were created
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name LIKE 'intel_%'
      ORDER BY table_name
    `);

    console.log(`  Created ${rows.length} intel_ tables:`);
    for (const row of rows) {
      console.log(`    - ${row.table_name}`);
    }

    // Verify enums
    const { rows: enums } = await client.query(`
      SELECT typname FROM pg_type
      WHERE typname LIKE 'intel_%' AND typtype = 'e'
      ORDER BY typname
    `);

    console.log(`\n  Created ${enums.length} intel_ ENUMs:`);
    for (const e of enums) {
      console.log(`    - ${e.typname}`);
    }

    console.log('\n  Schema setup complete.\n');
  } catch (err) {
    console.error('  ERROR:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
