/**
 * Data Migration Script
 * Reads inline JS data from index_v4.html and inserts into Supabase PostgreSQL.
 *
 * Usage:  node scripts/migrate-data.js
 * Or:     npm run migrate
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import supabase from '../lib/supabase.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_PATH = resolve(__dirname, '../../index_v4.html');

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Extract a JS variable assignment from the HTML source.
 * Handles both `var NAME = <value>;` and returns the parsed object/array.
 */
function extractVar(src, varName) {
  // Find `var VARNAME = ` or `var VARNAME=`
  const re = new RegExp(`var\\s+${varName}\\s*=\\s*`);
  const match = re.exec(src);
  if (!match) throw new Error(`Variable "${varName}" not found in HTML`);

  const startIdx = match.index + match[0].length;
  const opener = src[startIdx];

  if (opener !== '{' && opener !== '[') {
    throw new Error(`Expected { or [ after "var ${varName} =", got "${opener}"`);
  }

  const closer = opener === '{' ? '}' : ']';
  let depth = 0;
  let i = startIdx;
  // Track whether we are inside a string literal to avoid counting brackets inside strings
  let inString = false;
  let stringChar = '';

  for (; i < src.length; i++) {
    const ch = src[i];

    if (inString) {
      if (ch === '\\') { i++; continue; } // skip escaped char
      if (ch === stringChar) inString = false;
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      inString = true;
      stringChar = ch;
      continue;
    }

    if (ch === opener) depth++;
    else if (ch === closer) {
      depth--;
      if (depth === 0) break;
    }
  }

  const jsLiteral = src.slice(startIdx, i + 1);

  // Use Function constructor to evaluate the JS object literal
  try {
    return new Function('return ' + jsLiteral)();
  } catch (err) {
    throw new Error(`Failed to parse "${varName}": ${err.message}`);
  }
}

/**
 * Extract appended SIGNAL_DATA entries like `SIGNAL_DATA.butterfly = {...};`
 */
function extractAppendedSignalEntries(src, baseObj) {
  const pattern = /SIGNAL_DATA\.(\w+)\s*=\s*\{/g;
  let match;

  while ((match = pattern.exec(src)) !== null) {
    const key = match[1];
    // Start from the opening brace
    const braceStart = match.index + match[0].length - 1;
    let depth = 0;
    let inString = false;
    let stringChar = '';
    let i = braceStart;

    for (; i < src.length; i++) {
      const ch = src[i];
      if (inString) {
        if (ch === '\\') { i++; continue; }
        if (ch === stringChar) inString = false;
        continue;
      }
      if (ch === '"' || ch === "'" || ch === '`') {
        inString = true;
        stringChar = ch;
        continue;
      }
      if (ch === '{') depth++;
      else if (ch === '}') {
        depth--;
        if (depth === 0) break;
      }
    }

    const jsLiteral = src.slice(braceStart, i + 1);
    try {
      const parsed = new Function('return ' + jsLiteral)();
      // Only override if it has actual signals (non-empty), or if key doesn't exist yet
      if (parsed.signals && parsed.signals.length > 0) {
        baseObj[key] = parsed;
      } else if (!baseObj[key]) {
        baseObj[key] = parsed;
      }
    } catch {
      // skip parsing failures on guard statements like `if (!SIGNAL_DATA.x) ...`
    }
  }

  return baseObj;
}

function log(msg) { console.log(`  ${msg}`); }
function logOk(table, count) { console.log(`  ✓ ${table} — ${count} rows`); }
function logErr(table, err) { console.error(`  ✗ ${table} — ERROR: ${err}`); }

/**
 * Batch an array into chunks of given size
 */
function batch(arr, size = 500) {
  const batches = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

// ─── Name → Company ID lookup ───────────────────────────────────────────────

/**
 * Build a fuzzy lookup map: lowercased company name variants → company_id
 */
function buildNameMap(companyMeta) {
  const map = {};
  for (const [id, meta] of Object.entries(companyMeta)) {
    // Exact name
    map[meta.name.toLowerCase()] = id;
    // Without suffix " india", " limited", " industries", " of india"
    const stripped = meta.name
      .replace(/\s+(India|Limited|Industries|of India|Gandhimathi|Greaves Consumer|Greaves|Enterprises|Technologies|Electric|Electricals)$/i, '')
      .toLowerCase();
    map[stripped] = id;
    // Ticker
    map[meta.ticker.toLowerCase()] = id;
    // The key itself
    map[id.toLowerCase()] = id;
  }

  // Manual overrides for COMP_MOVES and OPPORTUNITY_DATA name mismatches
  map['crompton greaves'] = 'crompton';
  map['crompton greaves consumer'] = 'crompton';
  map['amber enterprises'] = 'amber';
  map['blue star'] = 'bluestar';
  map['butterfly gandhimathi'] = 'butterfly';
  map['dixon technologies'] = 'dixon';
  map['havells india'] = 'havells';
  map['v-guard industries'] = 'vguard';
  map['v-guard'] = 'vguard';
  map['ifb industries'] = 'ifb';
  map['orient electric'] = 'orient';
  map['symphony'] = 'symphony';
  map['symphony limited'] = 'symphony';
  map['ttk prestige'] = 'ttk';
  map['voltas'] = 'voltas';
  map['whirlpool of india'] = 'whirlpool';
  map['eureka forbes'] = 'eurekaforb';
  map['lg electronics india'] = 'lgeindia';
  map['bosch home comfort'] = null;         // not in our 16 companies
  map['bosch home comfort india'] = null;
  map['bse consumer durables index'] = null; // not a company
  map['bajaj electricals'] = 'bajaj';

  return map;
}

function resolveCompanyId(nameMap, name) {
  if (!name) return null;
  const key = name.toLowerCase().trim();
  if (key in nameMap) return nameMap[key];
  // Partial match fallback
  for (const [k, v] of Object.entries(nameMap)) {
    if (key.includes(k) || k.includes(key)) return v;
  }
  return null;
}

// ─── Main Migration ─────────────────────────────────────────────────────────

async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  A&M Industry Intel — Data Migration');
  console.log('═══════════════════════════════════════════════════\n');

  // 1. Read HTML
  log(`Reading ${HTML_PATH} ...`);
  const html = readFileSync(HTML_PATH, 'utf-8');
  log(`File size: ${(html.length / 1024).toFixed(0)} KB\n`);

  // 2. Extract all data structures
  log('Extracting data structures from inline JS ...');

  const FINANCIAL_DATA = extractVar(html, 'FINANCIAL_DATA');
  log(`  FINANCIAL_DATA: ${FINANCIAL_DATA.length} rows`);

  const COMPANY_META = extractVar(html, 'COMPANY_META');
  log(`  COMPANY_META: ${Object.keys(COMPANY_META).length} companies`);

  let SIGNAL_DATA = extractVar(html, 'SIGNAL_DATA');
  // Apply appended entries (butterfly, voltas, orient, vguard, bluestar, eurekaforb, lgeindia)
  SIGNAL_DATA = extractAppendedSignalEntries(html, SIGNAL_DATA);
  log(`  SIGNAL_DATA: ${Object.keys(SIGNAL_DATA).length} companies`);

  const NARRATIVE_DRIFT = extractVar(html, 'NARRATIVE_DRIFT');
  log(`  NARRATIVE_DRIFT: ${Object.keys(NARRATIVE_DRIFT).length} companies`);

  const ABSENCE_SIGNALS = extractVar(html, 'ABSENCE_SIGNALS');
  log(`  ABSENCE_SIGNALS: ${Object.keys(ABSENCE_SIGNALS).length} companies`);

  const COMP_MOVES = extractVar(html, 'COMP_MOVES');
  log(`  COMP_MOVES: ${COMP_MOVES.length} moves`);

  const OPPORTUNITY_DATA = extractVar(html, 'OPPORTUNITY_DATA');
  log(`  OPPORTUNITY_DATA: ${OPPORTUNITY_DATA.length} accounts`);

  const THEME_EVIDENCE = extractVar(html, 'THEME_EVIDENCE');
  log(`  THEME_EVIDENCE: ${Object.keys(THEME_EVIDENCE).length} themes`);

  const nameMap = buildNameMap(COMPANY_META);

  const summary = {};

  // ── Step 1: Companies ─────────────────────────────────────────────────────
  console.log('\n── Step 1: companies ──');
  try {
    const rows = Object.entries(COMPANY_META).map(([id, m]) => ({
      id,
      name: m.name,
      ticker: m.ticker,
      sub_sector: m.subSector,
      am_signal: m.amSignal,
      perf: m.perf,
      variance: m.variance || null,
      source: m.source || null,
    }));

    const { data, error } = await supabase
      .from('intel_companies')
      .upsert(rows, { onConflict: 'id' })
      .select();

    if (error) throw error;
    summary.companies = data.length;
    logOk('companies', data.length);
  } catch (err) {
    logErr('companies', err.message || err);
    summary.companies = 0;
  }

  // ── Step 2: Signal Taxonomy ───────────────────────────────────────────────
  console.log('\n── Step 2: signal_taxonomy ──');
  try {
    const rows = Object.entries(COMPANY_META)
      .filter(([, m]) => m.signalTaxonomy)
      .map(([id, m]) => {
        const t = m.signalTaxonomy;
        return {
          company_id: id,
          primary_type: t.primary,
          signals: t.signals || [],
          service_lines: t.serviceLines || [],
          urgency: t.urgency,
          thesis_situation: t.thesis?.situation || null,
          thesis_complication: t.thesis?.complication || null,
          thesis_implication: t.thesis?.implication || null,
        };
      });

    const { data, error } = await supabase
      .from('intel_signal_taxonomy')
      .upsert(rows, { onConflict: 'company_id' })
      .select();

    if (error) throw error;
    summary.signal_taxonomy = data.length;
    logOk('signal_taxonomy', data.length);
  } catch (err) {
    logErr('signal_taxonomy', err.message || err);
    summary.signal_taxonomy = 0;
  }

  // ── Step 3: Financial Periods ─────────────────────────────────────────────
  console.log('\n── Step 3: financial_periods ──');
  try {
    const rows = FINANCIAL_DATA.map((r) => ({
      company_id: r.id,
      fiscal_year: r.year,
      quarter: r.quarter || null,
      revenue: r.rev ?? null,
      ebitda_pct: r.ebitda_pct ?? null,
      pat: r.pat ?? null,
      rev_growth: r.rev_growth ?? null,
      roce: r.roce ?? null,
      de: r.de ?? null,
      pe: r.pe ?? null,
      wc_days: r.wc_days ?? null,
      inv_days: r.inv_days ?? null,
      debtor_days: r.debtor_days ?? null,
      ccc: r.ccc ?? null,
    }));

    const { data, error } = await supabase
      .from('intel_financial_periods')
      .upsert(rows, { onConflict: 'company_id,fiscal_year,quarter' })
      .select();

    if (error) throw error;
    summary.financial_periods = data.length;
    logOk('financial_periods', data.length);
  } catch (err) {
    logErr('financial_periods', err.message || err);
    summary.financial_periods = 0;
  }

  // ── Step 4: Product Mix ───────────────────────────────────────────────────
  console.log('\n── Step 4: product_mix ──');
  try {
    // Delete existing rows first for idempotency (no unique constraint to upsert on)
    await supabase.from('intel_product_mix').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const rows = [];
    for (const [id, m] of Object.entries(COMPANY_META)) {
      if (!m.productMix) continue;
      for (const p of m.productMix) {
        rows.push({
          company_id: id,
          segment: p.segment,
          percentage: p.pct,
        });
      }
    }

    const { data, error } = await supabase
      .from('intel_product_mix')
      .insert(rows)
      .select();

    if (error) throw error;
    summary.product_mix = data.length;
    logOk('product_mix', data.length);
  } catch (err) {
    logErr('product_mix', err.message || err);
    summary.product_mix = 0;
  }

  // ── Step 5: Premium Mix ───────────────────────────────────────────────────
  console.log('\n── Step 5: premium_mix ──');
  try {
    const rows = Object.entries(COMPANY_META)
      .filter(([, m]) => m.premiumMix)
      .map(([id, m]) => ({
        company_id: id,
        premium: m.premiumMix.premium,
        mass: m.premiumMix.mass,
        economy: m.premiumMix.economy,
      }));

    const { data, error } = await supabase
      .from('intel_premium_mix')
      .upsert(rows, { onConflict: 'company_id' })
      .select();

    if (error) throw error;
    summary.premium_mix = data.length;
    logOk('premium_mix', data.length);
  } catch (err) {
    logErr('premium_mix', err.message || err);
    summary.premium_mix = 0;
  }

  // ── Step 6 & 7: Signals + Signal Evidence ─────────────────────────────────
  console.log('\n── Step 6: signals ──');
  console.log('── Step 7: signal_evidence ──');
  let totalSignals = 0;
  let totalEvidence = 0;
  try {
    // Delete existing for idempotency (signal_evidence cascades from signals)
    await supabase.from('intel_signals').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const [companyId, compData] of Object.entries(SIGNAL_DATA)) {
      if (!compData.signals || compData.signals.length === 0) continue;

      const signalRows = compData.signals.map((s) => ({
        company_id: companyId,
        rank: s.r,
        indicator: s.ind,
        signal: s.sig,
        status: s.st,
        time_period: s.per,
        severity: s.sev,
        rationale: s.rat,
        confidence: s.conf,
      }));

      // Insert in batches
      for (const chunk of batch(signalRows, 100)) {
        const { data: insertedSignals, error: sigError } = await supabase
          .from('intel_signals')
          .insert(chunk)
          .select('id, rank');

        if (sigError) throw new Error(`signals insert (${companyId}): ${sigError.message}`);
        totalSignals += insertedSignals.length;

        // Build evidence rows for this batch
        const evidenceRows = [];
        for (const inserted of insertedSignals) {
          // Find the original signal by rank in this company to get evidence
          const original = compData.signals.find((s) => s.r === inserted.rank);
          if (original?.ev) {
            for (const e of original.ev) {
              evidenceRows.push({
                signal_id: inserted.id,
                quote: e.q,
                source_document: e.src,
                reference: e.ref || null,
              });
            }
          }
        }

        if (evidenceRows.length > 0) {
          for (const evChunk of batch(evidenceRows, 200)) {
            const { data: insertedEv, error: evError } = await supabase
              .from('intel_signal_evidence')
              .insert(evChunk)
              .select('id');

            if (evError) throw new Error(`signal_evidence insert (${companyId}): ${evError.message}`);
            totalEvidence += insertedEv.length;
          }
        }
      }
    }

    summary.signals = totalSignals;
    summary.signal_evidence = totalEvidence;
    logOk('signals', totalSignals);
    logOk('signal_evidence', totalEvidence);
  } catch (err) {
    logErr('signals / signal_evidence', err.message || err);
    summary.signals = totalSignals;
    summary.signal_evidence = totalEvidence;
  }

  // ── Step 8: Narrative Drifts ──────────────────────────────────────────────
  console.log('\n── Step 8: narrative_drifts ──');
  try {
    await supabase.from('intel_narrative_drifts').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const rows = [];
    for (const [companyId, compData] of Object.entries(NARRATIVE_DRIFT)) {
      if (!compData.drifts) continue;
      for (const d of compData.drifts) {
        rows.push({
          company_id: companyId,
          topic: d.topic,
          narrative_before: d.q1,
          narrative_after: d.q2,
          shift_type: d.shift,
          severity: d.severity,
          evidence: d.evidence,
          implication: d.implication,
        });
      }
    }

    const { data, error } = await supabase
      .from('intel_narrative_drifts')
      .insert(rows)
      .select();

    if (error) throw error;
    summary.narrative_drifts = data.length;
    logOk('narrative_drifts', data.length);
  } catch (err) {
    logErr('narrative_drifts', err.message || err);
    summary.narrative_drifts = 0;
  }

  // ── Step 9: Absence Signals ───────────────────────────────────────────────
  console.log('\n── Step 9: absence_signals ──');
  try {
    await supabase.from('intel_absence_signals').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const rows = [];
    for (const [companyId, compData] of Object.entries(ABSENCE_SIGNALS)) {
      if (!compData.absences) continue;
      for (const a of compData.absences) {
        rows.push({
          company_id: companyId,
          topic: a.topic,
          category: a.category,
          significance: a.significance,
          context: a.context,
          implication: a.implication,
        });
      }
    }

    const { data, error } = await supabase
      .from('intel_absence_signals')
      .insert(rows)
      .select();

    if (error) throw error;
    summary.absence_signals = data.length;
    logOk('absence_signals', data.length);
  } catch (err) {
    logErr('absence_signals', err.message || err);
    summary.absence_signals = 0;
  }

  // ── Step 10: Competitive Moves ────────────────────────────────────────────
  console.log('\n── Step 10: competitive_moves ──');
  try {
    await supabase.from('intel_competitive_moves').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const rows = COMP_MOVES.map((m) => {
      const companyId = resolveCompanyId(nameMap, m.company);
      return {
        company_id: companyId,
        move_type: m.type,
        description: m.desc,
        impact: m.impact,
        source: m.source,
        tier: m.tier || 'verified',
        move_date: m.date || null,
      };
    }).filter((r) => r.company_id !== null); // skip non-tracked companies (e.g., Bosch)

    const { data, error } = await supabase
      .from('intel_competitive_moves')
      .insert(rows)
      .select();

    if (error) throw error;
    summary.competitive_moves = data.length;
    logOk('competitive_moves', data.length);
  } catch (err) {
    logErr('competitive_moves', err.message || err);
    summary.competitive_moves = 0;
  }

  // ── Step 11: Themes + Theme Evidence ──────────────────────────────────────
  console.log('\n── Step 11: themes ──');
  console.log('── Step 12: theme_evidence ──');
  try {
    // Upsert themes first
    const themeRows = Object.entries(THEME_EVIDENCE).map(([themeId, t]) => ({
      id: themeId,
      title: t.title,
      theme_type: 'big_theme',
    }));

    const { data: themesInserted, error: themeErr } = await supabase
      .from('intel_themes')
      .upsert(themeRows, { onConflict: 'id' })
      .select();

    if (themeErr) throw themeErr;
    summary.themes = themesInserted.length;
    logOk('themes', themesInserted.length);

    // Delete and re-insert theme_evidence for idempotency
    await supabase.from('intel_theme_evidence').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const evidenceRows = [];
    for (const [themeId, t] of Object.entries(THEME_EVIDENCE)) {
      for (const c of t.companies) {
        const companyId = resolveCompanyId(nameMap, c.name);
        if (!companyId) {
          log(`  WARN: theme_evidence — could not resolve company "${c.name}", skipping`);
          continue;
        }
        evidenceRows.push({
          theme_id: themeId,
          company_id: companyId,
          metric: c.metric,
          evidence: c.evidence,
          source: c.source,
          url: c.url || null,
        });
      }
    }

    const { data: teInserted, error: teErr } = await supabase
      .from('intel_theme_evidence')
      .insert(evidenceRows)
      .select();

    if (teErr) throw teErr;
    summary.theme_evidence = teInserted.length;
    logOk('theme_evidence', teInserted.length);
  } catch (err) {
    logErr('themes / theme_evidence', err.message || err);
    summary.themes = summary.themes || 0;
    summary.theme_evidence = summary.theme_evidence || 0;
  }

  // ── Step 13 & 14: Opportunities + Sub-Opportunities ───────────────────────
  console.log('\n── Step 13: opportunities ──');
  console.log('── Step 14: sub_opportunities ──');
  let totalOpps = 0;
  let totalSubOpps = 0;
  try {
    // Delete existing for idempotency (sub_opportunities cascades)
    await supabase.from('intel_opportunities').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const opp of OPPORTUNITY_DATA) {
      const companyId = resolveCompanyId(nameMap, opp.account);

      const { data: oppInserted, error: oppErr } = await supabase
        .from('intel_opportunities')
        .insert({
          account: opp.account,
          company_id: companyId,
          stage: opp.stage,
        })
        .select('id')
        .single();

      if (oppErr) throw new Error(`opportunities insert (${opp.account}): ${oppErr.message}`);
      totalOpps++;

      if (opp.subs && opp.subs.length > 0) {
        const subRows = opp.subs.map((s) => ({
          opportunity_id: oppInserted.id,
          name: s.opp,
          service_line: s.service,
          signals: s.signals,
          source: s.source,
          tier: s.tier || 'verified',
        }));

        const { data: subInserted, error: subErr } = await supabase
          .from('intel_sub_opportunities')
          .insert(subRows)
          .select('id');

        if (subErr) throw new Error(`sub_opportunities insert (${opp.account}): ${subErr.message}`);
        totalSubOpps += subInserted.length;
      }
    }

    summary.opportunities = totalOpps;
    summary.sub_opportunities = totalSubOpps;
    logOk('opportunities', totalOpps);
    logOk('sub_opportunities', totalSubOpps);
  } catch (err) {
    logErr('opportunities / sub_opportunities', err.message || err);
    summary.opportunities = totalOpps;
    summary.sub_opportunities = totalSubOpps;
  }

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════');
  console.log('  Migration Summary');
  console.log('═══════════════════════════════════════════════════');
  console.log('');
  const tableWidth = 40;
  console.log('  ' + 'Table'.padEnd(tableWidth) + 'Rows');
  console.log('  ' + '─'.repeat(tableWidth) + '────');
  for (const [table, count] of Object.entries(summary)) {
    console.log('  ' + table.padEnd(tableWidth) + String(count));
  }
  const total = Object.values(summary).reduce((a, b) => a + b, 0);
  console.log('  ' + '─'.repeat(tableWidth) + '────');
  console.log('  ' + 'TOTAL'.padEnd(tableWidth) + String(total));
  console.log('');
  console.log('  Migration complete.\n');
}

main().catch((err) => {
  console.error('\nFATAL:', err);
  process.exit(1);
});
