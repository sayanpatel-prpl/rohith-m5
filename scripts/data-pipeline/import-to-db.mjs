/**
 * Import Sovrenn extracted data into SQLite database
 */

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PATH = path.join(__dirname, '..', '..', 'database', 'industry-landscape.db');
const SCHEMA_PATH = path.join(__dirname, '..', '..', 'database', 'schema.sql');
const DATA_PATH = path.join(__dirname, '..', '..', 'data-sources', 'extracted', 'sovrenn-intelligence.json');

async function initDatabase() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });

  // Create tables
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  await db.exec(schema);

  console.log('✓ Database initialized');
  return db;
}

async function clearExistingData(db) {
  await db.run('DELETE FROM shareholding');
  await db.run('DELETE FROM growth_triggers');
  await db.run('DELETE FROM concall_highlights');
  await db.run('DELETE FROM deals');
  await db.run('DELETE FROM quarterly_results');
  await db.run('DELETE FROM companies');

  console.log('✓ Cleared existing data');
}

async function importCompanies(db, companies) {
  console.log('\nImporting companies...');

  for (const company of companies) {
    await db.run(
      `INSERT OR REPLACE INTO companies (id, name, description, clients)
       VALUES (?, ?, ?, ?)`,
      [
        company.companyId,
        company.companyName,
        company.description,
        JSON.stringify(company.clients)
      ]
    );

    console.log(`  ✓ ${company.companyName}`);
  }
}

async function importQuarterlyResults(db, companies) {
  console.log('\nImporting quarterly results...');

  let count = 0;
  for (const company of companies) {
    for (const result of company.quarterlyResults) {
      await db.run(
        `INSERT OR REPLACE INTO quarterly_results
         (company_id, date, quarter, sales_cr, sales_growth_yoy, sales_growth_qoq,
          net_profit_cr, profit_growth_yoy, profit_growth_qoq, tag, raw_text)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          company.companyId,
          result.date,
          result.quarter,
          result.salesCr,
          result.salesGrowthYoY,
          result.salesGrowthQoQ,
          result.netProfitCr,
          result.profitGrowthYoY,
          result.profitGrowthQoQ,
          result.tag,
          result.rawText
        ]
      );
      count++;
    }
  }

  console.log(`  ✓ Imported ${count} quarterly results`);
}

async function importDeals(db, companies) {
  console.log('\nImporting deal activity...');

  let count = 0;
  for (const company of companies) {
    for (const deal of company.dealActivity) {
      await db.run(
        `INSERT INTO deals (company_id, date, type, description, value_cr)
         VALUES (?, ?, ?, ?, ?)`,
        [
          company.companyId,
          deal.date,
          deal.type,
          deal.description,
          deal.valueCr
        ]
      );
      count++;
    }
  }

  console.log(`  ✓ Imported ${count} deals`);
}

async function importConcalls(db, companies) {
  console.log('\nImporting concall highlights...');

  let count = 0;
  for (const company of companies) {
    for (const concall of company.concallHighlights) {
      await db.run(
        `INSERT OR REPLACE INTO concall_highlights (company_id, date, quarter, points)
         VALUES (?, ?, ?, ?)`,
        [
          company.companyId,
          concall.date,
          concall.quarter,
          JSON.stringify(concall.points)
        ]
      );
      count++;
    }
  }

  console.log(`  ✓ Imported ${count} concall summaries`);
}

async function importGrowthTriggers(db, companies) {
  console.log('\nImporting growth triggers...');

  let count = 0;
  for (const company of companies) {
    for (const trigger of company.keyGrowthTriggers) {
      await db.run(
        `INSERT INTO growth_triggers (company_id, trigger_text)
         VALUES (?, ?)`,
        [company.companyId, trigger]
      );
      count++;
    }
  }

  console.log(`  ✓ Imported ${count} growth triggers`);
}

async function importShareholding(db, companies) {
  console.log('\nImporting shareholding data...');

  let count = 0;
  for (const company of companies) {
    for (const holding of company.shareholding) {
      await db.run(
        `INSERT INTO shareholding (company_id, date, holder, stake)
         VALUES (?, ?, ?, ?)`,
        [company.companyId, holding.date, holding.holder, holding.stake]
      );
      count++;
    }
  }

  console.log(`  ✓ Imported ${count} shareholding records`);
}

async function main() {
  try {
    // Load extracted data
    const companies = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    console.log(`Loaded ${companies.length} companies from ${DATA_PATH}`);

    // Initialize database
    const db = await initDatabase();

    // Clear existing data
    await clearExistingData(db);

    // Import all data
    await importCompanies(db, companies);
    await importQuarterlyResults(db, companies);
    await importDeals(db, companies);
    await importConcalls(db, companies);
    await importGrowthTriggers(db, companies);
    await importShareholding(db, companies);

    // Show summary
    const stats = await db.all(`
      SELECT
        (SELECT COUNT(*) FROM companies) as companies,
        (SELECT COUNT(*) FROM quarterly_results) as quarterly_results,
        (SELECT COUNT(*) FROM deals) as deals,
        (SELECT COUNT(*) FROM concall_highlights) as concalls,
        (SELECT COUNT(*) FROM growth_triggers) as growth_triggers,
        (SELECT COUNT(*) FROM shareholding) as shareholding
    `);

    console.log('\n✅ Import complete!');
    console.log('\nDatabase summary:');
    console.log(`  Companies: ${stats[0].companies}`);
    console.log(`  Quarterly Results: ${stats[0].quarterly_results}`);
    console.log(`  Deals: ${stats[0].deals}`);
    console.log(`  Concalls: ${stats[0].concalls}`);
    console.log(`  Growth Triggers: ${stats[0].growth_triggers}`);
    console.log(`  Shareholding Records: ${stats[0].shareholding}`);
    console.log(`\nDatabase: ${DB_PATH}`);

    await db.close();
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

main();
