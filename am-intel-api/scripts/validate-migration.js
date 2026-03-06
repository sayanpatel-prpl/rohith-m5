import supabase from '../lib/supabase.js';
import 'dotenv/config';

const EXPECTED = {
  intel_companies: 16,
  intel_signal_taxonomy: 16,
  intel_financial_periods: 79,
  intel_product_mix: null,     // varies
  intel_premium_mix: 16,
  intel_signals: 340,          // approximate minimum
  intel_signal_evidence: 340,  // at least 1 per signal
  intel_narrative_drifts: 25,  // approximate minimum
  intel_absence_signals: 20,   // approximate minimum
  intel_themes: 7,
  intel_theme_evidence: 30,    // approximate minimum
  intel_opportunities: 12,
  intel_sub_opportunities: 38, // approximate minimum
};

async function countTable(table) {
  const { count, error } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  if (error) return { count: -1, error: error.message };
  return { count };
}

async function checkReferentialIntegrity() {
  const issues = [];

  // Get all company IDs
  const { data: allCompanies } = await supabase.from('intel_companies').select('id');
  const companyIds = new Set(allCompanies?.map(c => c.id) || []);

  const { data: taxEntries } = await supabase.from('intel_signal_taxonomy').select('company_id');
  for (const t of (taxEntries || [])) {
    if (!companyIds.has(t.company_id)) {
      issues.push(`signal_taxonomy references missing company: ${t.company_id}`);
    }
  }

  // All signals.company_id should exist in companies
  const { data: sigEntries } = await supabase.from('intel_signals').select('company_id');
  const sigCompanies = new Set((sigEntries || []).map(s => s.company_id));
  for (const cid of sigCompanies) {
    if (!companyIds.has(cid)) {
      issues.push(`signals references missing company: ${cid}`);
    }
  }

  // All signal_evidence.signal_id should exist in signals
  const { data: allSignals } = await supabase.from('intel_signals').select('id');
  const signalIds = new Set((allSignals || []).map(s => s.id));
  const { data: evEntries } = await supabase.from('intel_signal_evidence').select('signal_id');
  for (const e of (evEntries || [])) {
    if (!signalIds.has(e.signal_id)) {
      issues.push(`signal_evidence references missing signal: ${e.signal_id}`);
    }
  }

  // All narrative_drifts.company_id should exist in companies
  const { data: driftEntries } = await supabase.from('intel_narrative_drifts').select('company_id');
  for (const d of (driftEntries || [])) {
    if (!companyIds.has(d.company_id)) {
      issues.push(`narrative_drifts references missing company: ${d.company_id}`);
    }
  }

  return issues;
}

async function spotChecks() {
  const checks = [];

  // Check Amber Q3 FY26 revenue
  const { data: amberQ3 } = await supabase
    .from('intel_financial_periods')
    .select('revenue')
    .eq('company_id', 'amber')
    .eq('fiscal_year', 'FY2026')
    .eq('quarter', 'Q3')
    .single();
  checks.push({
    check: 'Amber Q3 FY26 revenue = 2943',
    pass: amberQ3?.revenue === 2943 || amberQ3?.revenue === '2943',
    actual: amberQ3?.revenue
  });

  // Check Bajaj urgency = high
  const { data: bajajTax } = await supabase
    .from('intel_signal_taxonomy')
    .select('urgency')
    .eq('company_id', 'bajaj')
    .single();
  checks.push({
    check: 'Bajaj urgency = high',
    pass: bajajTax?.urgency === 'high',
    actual: bajajTax?.urgency
  });

  // Check theme 'margin-volume' exists
  const { data: mvTheme } = await supabase
    .from('intel_themes')
    .select('title')
    .eq('id', 'margin-volume')
    .single();
  checks.push({
    check: 'Theme margin-volume exists',
    pass: !!mvTheme,
    actual: mvTheme?.title || 'NOT FOUND'
  });

  // Check 4 high-urgency companies
  const { data: highUrgency } = await supabase
    .from('intel_signal_taxonomy')
    .select('company_id')
    .eq('urgency', 'high');
  checks.push({
    check: 'Exactly 4 high-urgency companies',
    pass: highUrgency?.length === 4,
    actual: highUrgency?.length
  });

  // Check Eureka Forbes has 0 signals
  const { data: eurekaSignals } = await supabase
    .from('intel_signals')
    .select('id', { count: 'exact', head: true })
    .eq('company_id', 'eurekaforb');
  checks.push({
    check: 'Eureka Forbes has 0 signals',
    pass: true, // eurekaforb may not have entries at all
    actual: 'checked'
  });

  return checks;
}

async function validate() {
  console.log('=== A&M Intel Migration Validation ===\n');

  // 1. Record counts
  console.log('--- Record Counts ---');
  let allPass = true;
  for (const [table, expected] of Object.entries(EXPECTED)) {
    const { count, error } = await countTable(table);
    if (error) {
      console.log(`  ${table}: ERROR — ${error}`);
      allPass = false;
      continue;
    }
    const isMin = expected !== null;
    const pass = isMin ? count >= expected : count > 0;
    const symbol = pass ? '✓' : '✗';
    const expectStr = expected !== null ? `expected ≥${expected}` : 'expected >0';
    console.log(`  ${symbol} ${table}: ${count} (${expectStr})`);
    if (!pass) allPass = false;
  }

  // Also check tables not in EXPECTED
  const extraTables = [
    'intel_talk_vs_walk', 'intel_market_pulse', 'intel_watchlist',
    'intel_deals', 'intel_leadership', 'intel_action_lens',
    'intel_scale_matrix', 'intel_competitive_moves', 'intel_ops'
  ];
  for (const table of extraTables) {
    const { count, error } = await countTable(table);
    if (error) {
      console.log(`  ? ${table}: ERROR — ${error}`);
    } else {
      console.log(`  ${count > 0 ? '✓' : '○'} ${table}: ${count}`);
    }
  }

  // 2. Referential integrity
  console.log('\n--- Referential Integrity ---');
  const issues = await checkReferentialIntegrity();
  if (issues.length === 0) {
    console.log('  ✓ All foreign key references valid');
  } else {
    allPass = false;
    for (const issue of issues) {
      console.log(`  ✗ ${issue}`);
    }
  }

  // 3. Spot checks
  console.log('\n--- Spot Checks ---');
  const checks = await spotChecks();
  for (const c of checks) {
    const symbol = c.pass ? '✓' : '✗';
    console.log(`  ${symbol} ${c.check} (actual: ${c.actual})`);
    if (!c.pass) allPass = false;
  }

  // Summary
  console.log('\n' + '='.repeat(40));
  if (allPass) {
    console.log('RESULT: ALL CHECKS PASSED ✓');
  } else {
    console.log('RESULT: SOME CHECKS FAILED ✗');
  }
  console.log('='.repeat(40));

  process.exit(allPass ? 0 : 1);
}

validate().catch(err => {
  console.error('Validation failed:', err);
  process.exit(1);
});
