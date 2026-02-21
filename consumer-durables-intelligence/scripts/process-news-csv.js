/**
 * process-news-csv.js
 *
 * Reads the NEWS CSV data source, maps company names to dashboard company IDs,
 * assigns source tiers, filters stale/invalid items, and outputs a structured
 * JS data file for the consumer-durables-intelligence dashboard.
 *
 * Usage:  node scripts/process-news-csv.js
 * Output: ../assets/js/news-data.js
 *
 * No npm dependencies -- uses only Node built-in fs and path modules.
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const CSV_PATH = path.join(
  __dirname,
  '..',
  'data_sources',
  'Data source - NEWS - news + reports .csv'
);
const OUTPUT_PATH = path.join(__dirname, '..', 'assets', 'js', 'news-data.js');

// ---------------------------------------------------------------------------
// Company name -> dashboard company ID mapping
// Uses lowercase lookup for case-insensitive matching.
// ---------------------------------------------------------------------------
const COMPANY_NAME_MAP = {
  'whirlpool of india limited': 'whirlpool',
  'whirlpool': 'whirlpool',
  'voltas limited': 'voltas',
  'voltas': 'voltas',
  'blue star limited': 'bluestar',
  'blue star': 'bluestar',
  'crompton greaves consumer electricals limited': 'crompton',
  'crompton': 'crompton',
  'bajaj electricals limited': 'bajaj_elec',
  'bajaj electricals': 'bajaj_elec',
  'v-guard industries limited': 'vguard',
  'v-guard': 'vguard',
  'ifb industries limited': 'ifb',
  'ifb': 'ifb',
  'havells india limited': 'havells',
  'havells': 'havells',
  'symphony limited': 'symphony',
  'symphony': 'symphony',
  'orient electric limited': 'orient',
  'orient electric': 'orient',
  'orient': 'orient',
  'dixon technologies (india) limited': 'dixon',
  'dixon technologies': 'dixon',
  'dixon': 'dixon',
  'amber enterprises india limited': 'amber',
  'amber enterprises': 'amber',
  'amber': 'amber',
  'ttk prestige limited': 'ttk_prestige',
  'ttk prestige': 'ttk_prestige',
  'butterfly gandhimathi appliances limited': 'butterfly',
  'butterfly': 'butterfly',
  'johnson controls-hitachi air conditioning india limited': 'bosch_jch',
  'johnson controls-hitachi': 'bosch_jch',
  'samsung': 'samsung',
  'samsung electronics': 'samsung',
};

// Display names for each company ID
const COMPANY_DISPLAY_NAMES = {
  whirlpool: 'Whirlpool India',
  voltas: 'Voltas',
  bluestar: 'Blue Star',
  crompton: 'Crompton',
  bajaj_elec: 'Bajaj Electricals',
  vguard: 'V-Guard',
  ifb: 'IFB Industries',
  havells: 'Havells',
  symphony: 'Symphony',
  orient: 'Orient Electric',
  dixon: 'Dixon Technologies',
  amber: 'Amber Enterprises',
  ttk_prestige: 'TTK Prestige',
  butterfly: 'Butterfly Gandhimathi',
  bosch_jch: 'Johnson Controls-Hitachi',
  samsung: 'Samsung',
};

// ---------------------------------------------------------------------------
// Source tier classification
// ---------------------------------------------------------------------------
const T1_KEYWORDS = [
  'bse', 'nse', 'sebi', 'company filing', 'annual report',
  'official company announcement',
];
const T2_KEYWORDS = [
  'business standard', 'economic times', 'mint', 'moneycontrol',
  'reuters', 'bloomberg', 'cnbc', 'livemint',
];
const T3_KEYWORDS = [
  'samsung newsroom', 'newsroom', 'investor presentation',
  'industry report', 'official press release',
];

/**
 * Determine source tier (1-4) from the source field string.
 */
function getSourceTier(source) {
  if (!source) return 4;
  const lower = source.toLowerCase();
  if (T1_KEYWORDS.some((kw) => lower.includes(kw))) return 1;
  if (T2_KEYWORDS.some((kw) => lower.includes(kw))) return 2;
  if (T3_KEYWORDS.some((kw) => lower.includes(kw))) return 3;
  return 4;
}

/**
 * Map tier to credibility label.
 */
function tierToCredibility(tier) {
  if (tier <= 2) return 'high';
  if (tier === 3) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// CSV parser -- handles quoted fields with embedded commas and newlines
// ---------------------------------------------------------------------------
const EXPECTED_COLUMNS = 14; // number of header columns

/**
 * Parse an RFC-4180-style CSV file content into an array of string arrays.
 *
 * Handles:
 *   - Double-quoted fields with embedded commas, newlines, and escaped quotes ("")
 *   - Fields that span multiple lines
 *   - Unquoted fields
 *
 * Returns an array of rows, where each row is an array of field strings.
 */
function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        // Check for escaped quote ""
        if (i + 1 < text.length && text[i + 1] === '"') {
          currentField += '"';
          i += 2;
          continue;
        }
        // End of quoted field
        inQuotes = false;
        i++;
        continue;
      }
      // Any other character inside quotes (including newlines) is literal
      currentField += ch;
      i++;
      continue;
    }

    // Not inside quotes
    if (ch === '"') {
      // Start of quoted field (should be at field start, but be lenient)
      inQuotes = true;
      i++;
      continue;
    }

    if (ch === ',') {
      currentRow.push(currentField);
      currentField = '';
      i++;
      continue;
    }

    if (ch === '\r') {
      // Handle \r\n or bare \r as row end
      if (i + 1 < text.length && text[i + 1] === '\n') {
        i++; // skip the \n
      }
      currentRow.push(currentField);
      currentField = '';
      // Only push row if it has the expected number of columns,
      // or if it is a non-empty row (avoids trailing blank lines).
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      i++;
      continue;
    }

    if (ch === '\n') {
      currentRow.push(currentField);
      currentField = '';
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }
      currentRow = [];
      i++;
      continue;
    }

    currentField += ch;
    i++;
  }

  // Handle last field/row if file doesn't end with newline
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.length > 0) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Merge rows that are continuations of a multi-line quoted field.
 *
 * After the character-level parse, every logical CSV record should already be
 * one row. However, if the parser above produces rows with fewer columns than
 * expected, those are continuation fragments from a multi-line field. This
 * function is a safety net that merges them back.
 */
function mergeIncompleteRows(rows, expectedCols) {
  const merged = [];
  let pending = null;

  for (const row of rows) {
    if (pending) {
      // Append this row's content to the last field of the pending row
      const lastIdx = pending.length - 1;
      pending[lastIdx] += '\n' + row[0];
      // Append any additional fields from this continuation row
      for (let k = 1; k < row.length; k++) {
        pending.push(row[k]);
      }
      if (pending.length >= expectedCols) {
        merged.push(pending);
        pending = null;
      }
      // else keep accumulating
    } else if (row.length < expectedCols) {
      pending = row.slice();
    } else {
      merged.push(row);
    }
  }

  // If there is a leftover pending row, push it anyway
  if (pending) {
    merged.push(pending);
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/**
 * Parse a date string into a Date object. Handles:
 *   - YYYY-MM-DD
 *   - DD/MM/YYYY
 *   - MM/DD/YYYY (fallback)
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return new Date(trimmed + 'T00:00:00Z');
  }

  // DD/MM/YYYY or MM/DD/YYYY -- CSV appears to use YYYY-MM-DD, but be safe
  const slashMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    const [, a, b, year] = slashMatch;
    // Assume DD/MM/YYYY if first number > 12
    if (Number(a) > 12) {
      return new Date(`${year}-${b.padStart(2, '0')}-${a.padStart(2, '0')}T00:00:00Z`);
    }
    // Otherwise treat as MM/DD/YYYY
    return new Date(`${year}-${a.padStart(2, '0')}-${b.padStart(2, '0')}T00:00:00Z`);
  }

  // Last resort: let JS parse it
  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Format a Date to YYYY-MM-DD string.
 */
function formatDate(d) {
  if (!d) return '';
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// ---------------------------------------------------------------------------
// Filtering criteria
// ---------------------------------------------------------------------------
const REFERENCE_DATE = new Date('2026-02-21T00:00:00Z');
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
const CUTOFF_DATE = new Date(REFERENCE_DATE.getTime() - NINETY_DAYS_MS);

// Categories that are exempt from the 90-day recency filter
const EXEMPT_CATEGORIES = [
  'regulatory', 'structural', 'regulation', 'policy',
  'compliance', 'governance',
];

function isCategoryExempt(category) {
  if (!category) return false;
  const lower = category.toLowerCase();
  return EXEMPT_CATEGORIES.some((kw) => lower.includes(kw));
}

// ---------------------------------------------------------------------------
// Resolve company name to ID
// ---------------------------------------------------------------------------
function resolveCompanyId(rawName) {
  if (!rawName) return null;
  const lower = rawName.trim().toLowerCase();
  if (!lower) return null;

  // Direct lookup
  if (COMPANY_NAME_MAP[lower]) return COMPANY_NAME_MAP[lower];

  // Try without trailing 'limited' or 'ltd' or 'ltd.'
  const stripped = lower.replace(/\s+(limited|ltd\.?)$/i, '').trim();
  if (COMPANY_NAME_MAP[stripped]) return COMPANY_NAME_MAP[stripped];

  // Fuzzy: check if any key is a substring or vice-versa
  for (const [key, id] of Object.entries(COMPANY_NAME_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return id;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main processing
// ---------------------------------------------------------------------------
function main() {
  // Read CSV
  console.log('Reading CSV from:', CSV_PATH);
  if (!fs.existsSync(CSV_PATH)) {
    console.error('ERROR: CSV file not found at', CSV_PATH);
    process.exit(1);
  }

  const raw = fs.readFileSync(CSV_PATH, 'utf-8');
  console.log('CSV file size:', (raw.length / 1024).toFixed(1), 'KB');

  // Parse
  console.log('Parsing CSV...');
  const rawRows = parseCSV(raw);
  console.log('Raw parsed rows:', rawRows.length);

  // Header row
  if (rawRows.length === 0) {
    console.error('ERROR: CSV appears empty.');
    process.exit(1);
  }

  const header = rawRows[0].map((h) => h.trim().toLowerCase());
  console.log('Header columns:', header.length, '-', header.join(', '));

  // Merge incomplete rows (multi-line fields that weren't fully captured)
  const dataRows = mergeIncompleteRows(rawRows.slice(1), header.length);
  console.log('Data rows after merge:', dataRows.length);

  // Build column index map
  const colIdx = {};
  header.forEach((col, i) => {
    colIdx[col] = i;
  });

  // Required column indices
  const iNewsId = colIdx['news_id'];
  const iCompanyName = colIdx['company_name'];
  const iNewsTitle = colIdx['news_title'];
  const iSource = colIdx['source'];
  const iDate = colIdx['date'];
  const iUrl = colIdx['url'];
  const iCategory = colIdx['category'];
  const iSummary = colIdx['key_insight_summary'];
  const iCxoQuote = colIdx['cxo_quote'];
  const iStrategicImpl = colIdx['strategic_implication'];

  // Validate required columns exist
  const requiredCols = [
    'news_id', 'company_name', 'news_title', 'source',
    'date', 'url', 'category', 'key_insight_summary',
  ];
  for (const col of requiredCols) {
    if (colIdx[col] === undefined) {
      console.error('ERROR: Missing required column:', col);
      console.error('Available columns:', header.join(', '));
      process.exit(1);
    }
  }

  // Process rows
  const items = [];
  let totalProcessed = 0;
  let filteredCount = 0;
  const filterReasons = {
    noCompanyName: 0,
    unmappedCompany: 0,
    noTitle: 0,
    tooOld: 0,
  };
  const unmappedCompanies = new Set();
  let autoId = 0;

  for (const row of dataRows) {
    totalProcessed++;

    // Extract fields (with safe bounds checking)
    const get = (idx) => (idx !== undefined && idx < row.length ? (row[idx] || '').trim() : '');

    const rawCompanyName = get(iCompanyName);
    const newsTitle = get(iNewsTitle);
    const source = get(iSource);
    const dateStr = get(iDate);
    const url = get(iUrl);
    const category = get(iCategory);
    const summary = get(iSummary);
    const cxoQuote = get(iCxoQuote);
    const strategicImplication = get(iStrategicImpl);

    // Filter: empty company name
    if (!rawCompanyName) {
      filteredCount++;
      filterReasons.noCompanyName++;
      continue;
    }

    // Filter: unmapped company
    const companyId = resolveCompanyId(rawCompanyName);
    if (!companyId) {
      filteredCount++;
      filterReasons.unmappedCompany++;
      unmappedCompanies.add(rawCompanyName);
      continue;
    }

    // Filter: no title
    if (!newsTitle) {
      filteredCount++;
      filterReasons.noTitle++;
      continue;
    }

    // Parse date
    const parsedDate = parseDate(dateStr);
    const formattedDate = parsedDate ? formatDate(parsedDate) : dateStr;

    // Filter: older than 90 days (unless category is regulatory/structural)
    if (parsedDate && parsedDate < CUTOFF_DATE && !isCategoryExempt(category)) {
      filteredCount++;
      filterReasons.tooOld++;
      continue;
    }

    // Determine source tier and credibility
    const sourceTier = getSourceTier(source);
    const sourceCredibility = tierToCredibility(sourceTier);

    autoId++;

    items.push({
      id: autoId,
      companyId: companyId,
      company: COMPANY_DISPLAY_NAMES[companyId] || rawCompanyName,
      title: newsTitle,
      date: formattedDate,
      source: source,
      sourceUrl: url,
      category: category,
      sourceTier: sourceTier,
      sourceCredibility: sourceCredibility,
      summary: summary || null,
      cxoQuote: cxoQuote || null,
      strategicImplication: strategicImplication || null,
    });
  }

  // Sort items by date descending (most recent first)
  items.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  // Output stats
  console.log('\n--- Processing Summary ---');
  console.log('Total data rows processed:', totalProcessed);
  console.log('Items passing filters:', items.length);
  console.log('Items filtered out:', filteredCount);
  console.log('  - No company name:', filterReasons.noCompanyName);
  console.log('  - Unmapped company:', filterReasons.unmappedCompany);
  console.log('  - No title:', filterReasons.noTitle);
  console.log('  - Older than 90 days:', filterReasons.tooOld);

  if (unmappedCompanies.size > 0) {
    console.log('\nUnmapped company names:');
    for (const name of unmappedCompanies) {
      console.log('  -', JSON.stringify(name));
    }
  }

  // Tier distribution
  const tierCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };
  for (const item of items) {
    tierCounts[item.sourceTier]++;
  }
  console.log('\nSource tier distribution:');
  console.log('  T1 (Regulatory/Filing):', tierCounts[1]);
  console.log('  T2 (Major Press):', tierCounts[2]);
  console.log('  T3 (Trade/Industry):', tierCounts[3]);
  console.log('  T4 (General):', tierCounts[4]);

  // Company distribution
  const companyCounts = {};
  for (const item of items) {
    companyCounts[item.companyId] = (companyCounts[item.companyId] || 0) + 1;
  }
  console.log('\nItems per company:');
  for (const [id, count] of Object.entries(companyCounts).sort((a, b) => b[1] - a[1])) {
    console.log('  ', id, ':', count);
  }

  // Build output
  const outputData = {
    items: items,
    lastUpdated: '2026-02-21',
    totalProcessed: totalProcessed,
    filtered: filteredCount,
  };

  // Write JS file
  const jsContent = [
    '/**',
    ' * NEWS_DATA -- auto-generated by scripts/process-news-csv.js',
    ' * Source: Data source - NEWS - news + reports .csv',
    ' * Generated: ' + new Date().toISOString(),
    ' * Total processed: ' + totalProcessed,
    ' * Items included: ' + items.length,
    ' * Items filtered: ' + filteredCount,
    ' */',
    '// eslint-disable-next-line no-unused-vars',
    'const NEWS_DATA = ' + JSON.stringify(outputData, null, 2) + ';',
    '',
  ].join('\n');

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, jsContent, 'utf-8');
  console.log('\nOutput written to:', OUTPUT_PATH);
  console.log('Output size:', (jsContent.length / 1024).toFixed(1), 'KB');
}

main();
