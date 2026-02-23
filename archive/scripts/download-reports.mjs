/**
 * Download all financial reports (PDFs) from cataloged IR document URLs
 * Reads company-ir-documents.json and downloads to data-sources/quarterly-reports/
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'data-sources', 'extracted', 'company-ir-documents.json');
const REPORTS_DIR = path.join(ROOT, 'data-sources', 'quarterly-reports');

// Map catalog companyId to folder names used in quarterly-reports
const ID_MAP = {
  'voltas': 'voltas',
  'bluestar': 'bluestar',
  'havells': 'havells',
  'crompton': 'crompton',
  'whirlpool': 'whirlpool',
  'symphony': 'symphony',
  'orient-electric': 'orient',
  'bajaj-electricals': 'bajaj',
  'vguard': 'vguard',
  'ttk-prestige': 'ttk',
  'butterfly': 'butterfly',
  'amber': 'amber',
  'dixon': 'dixon',
  'jchac': 'jch',
  'ifb': 'ifb',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function sanitizeFilename(url, fallbackName) {
  // Extract filename from URL
  try {
    const urlPath = new URL(url).pathname;
    let filename = path.basename(urlPath);
    // Decode URL encoding
    filename = decodeURIComponent(filename);
    // Clean up
    filename = filename.replace(/[<>:"|?*]/g, '_');
    if (filename && filename.endsWith('.pdf')) return filename;
    if (filename && filename.endsWith('.html')) return filename;
  } catch (e) {}
  return fallbackName + '.pdf';
}

async function downloadFile(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/pdf,*/*',
      },
      redirect: 'follow',
    });

    if (!res.ok) {
      return { success: false, error: `HTTP ${res.status} ${res.statusText}` };
    }

    const contentType = res.headers.get('content-type') || '';
    const buffer = Buffer.from(await res.arrayBuffer());

    // Verify it's actually a PDF or meaningful file (not an HTML error page)
    if (buffer.length < 500 && contentType.includes('text/html')) {
      return { success: false, error: 'Got HTML page instead of PDF' };
    }

    fs.writeFileSync(destPath, buffer);
    const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
    return { success: true, size: `${sizeMB} MB` };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  PDF Report Downloader - Kompete Industry Intel');
  console.log('═══════════════════════════════════════════════════════════════');

  // Read catalog
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  const companies = catalog.companies;

  // Collect all downloadable URLs
  const downloads = [];

  for (const company of companies) {
    const folderId = ID_MAP[company.companyId] || company.companyId;
    const docs = company.documents;

    // Annual Reports
    for (const doc of (docs.annualReports || [])) {
      if (doc.url && (doc.url.endsWith('.pdf') || doc.url.includes('/pdf/') || doc.url.includes('.pdf'))) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'annual-reports',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Quarterly Results
    for (const doc of (docs.quarterlyResults || [])) {
      if (doc.url && (doc.url.endsWith('.pdf') || doc.url.includes('/pdf/') || doc.url.includes('.pdf'))) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'quarterly-results',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Investor Presentations
    for (const doc of (docs.investorPresentations || [])) {
      if (doc.url && (doc.url.endsWith('.pdf') || doc.url.includes('/pdf/') || doc.url.includes('.pdf'))) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'investor-presentations',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Earnings Transcripts
    for (const doc of (docs.earningsTranscripts || [])) {
      if (doc.url && (doc.url.endsWith('.pdf') || doc.url.includes('/pdf/') || doc.url.includes('.pdf'))) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'earnings-transcripts',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Sustainability / BRSR Reports
    for (const doc of (docs.sustainabilityReports || [])) {
      if (doc.url && doc.url.endsWith('.pdf')) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'other-reports',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Subsidiary Reports
    for (const doc of (docs.subsidiaryReports || [])) {
      if (doc.url && doc.url.endsWith('.pdf')) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'other-reports',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Ten Year Performance
    for (const doc of (docs.tenYearPerformance || [])) {
      if (doc.url && doc.url.endsWith('.pdf')) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'other-reports',
          title: doc.title,
          url: doc.url,
        });
      }
    }

    // Corporate Governance
    for (const doc of (docs.corporateGovernance || [])) {
      if (doc.url && doc.url.endsWith('.pdf')) {
        downloads.push({
          company: company.companyName,
          folderId,
          category: 'corporate-governance',
          title: doc.title,
          url: doc.url,
        });
      }
    }
  }

  console.log(`  Found ${downloads.length} downloadable PDFs across ${companies.length} companies\n`);

  const results = { success: [], failed: [], skipped: [] };

  for (let i = 0; i < downloads.length; i++) {
    const dl = downloads[i];
    const companyDir = path.join(REPORTS_DIR, dl.folderId, dl.category);
    fs.mkdirSync(companyDir, { recursive: true });

    const filename = sanitizeFilename(dl.url, dl.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 80));
    const destPath = path.join(companyDir, filename);

    // Skip if already downloaded
    if (fs.existsSync(destPath)) {
      console.log(`  ⏭  [${i + 1}/${downloads.length}] ${dl.company} — ${filename} (already exists)`);
      results.skipped.push({ ...dl, filename });
      continue;
    }

    console.log(`  ⬇  [${i + 1}/${downloads.length}] ${dl.company} — ${dl.category}/${filename}`);
    const result = await downloadFile(dl.url, destPath);

    if (result.success) {
      console.log(`      ✓ Downloaded (${result.size})`);
      results.success.push({ ...dl, filename, size: result.size });
    } else {
      console.log(`      ✗ Failed: ${result.error}`);
      results.failed.push({ ...dl, filename, error: result.error });
      // Remove empty/corrupt file if created
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
    }

    // Brief delay to be polite to servers
    await sleep(2000);
  }

  // Save download manifest
  const manifest = {
    downloadedAt: new Date().toISOString(),
    totalAttempted: downloads.length,
    successful: results.success.length,
    failed: results.failed.length,
    skipped: results.skipped.length,
    downloads: results,
  };

  fs.writeFileSync(
    path.join(REPORTS_DIR, 'download-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Print summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  DOWNLOAD REPORT');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`  ✓ Successfully downloaded: ${results.success.length}`);
  console.log(`  ✗ Failed: ${results.failed.length}`);
  console.log(`  ⏭  Skipped (already exist): ${results.skipped.length}`);

  if (results.success.length > 0) {
    console.log('\n  Downloaded files by company:');
    const byCompany = {};
    for (const s of results.success) {
      if (!byCompany[s.company]) byCompany[s.company] = [];
      byCompany[s.company].push(`${s.category}/${s.filename} (${s.size})`);
    }
    for (const [company, files] of Object.entries(byCompany)) {
      console.log(`\n  📁 ${company}:`);
      files.forEach(f => console.log(`    → ${f}`));
    }
  }

  if (results.failed.length > 0) {
    console.log('\n  Failed downloads:');
    for (const f of results.failed) {
      console.log(`    ✗ ${f.company} — ${f.url}`);
      console.log(`      Error: ${f.error}`);
    }
  }

  console.log('\n  📁 Reports saved to: data-sources/quarterly-reports/{company}/{category}/');
  console.log('  📋 Manifest: data-sources/quarterly-reports/download-manifest.json');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
