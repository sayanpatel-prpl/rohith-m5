import supabase from '../lib/supabase.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

const DIMENSION = 'synthesis';

/**
 * Synthesis & Advisory Agent — Cross-dimensional pattern detection.
 * Maps patterns to A&M service lines. Updates opportunities & watchlist.
 */

// Cross-dimensional pattern definitions
const PATTERN_RULES = [
  {
    type: 'turnaround_candidate',
    title: 'Turnaround Candidate',
    serviceLines: ['Turnaround', 'Interim Management', 'PEPI'],
    detect: async (companyId) => {
      // Financial stress + narrative drift + leadership change
      const [financials, drifts, leadership] = await Promise.all([
        supabase.from('intel_financial_signals')
          .select('*').eq('company_id', companyId)
          .in('severity', ['Critical', 'High']),
        supabase.from('intel_narrative_drifts')
          .select('*').eq('company_id', companyId)
          .in('severity', ['critical', 'high']),
        supabase.from('intel_leadership')
          .select('*').eq('company_id', companyId),
      ]);

      const hasFinancialStress = (financials.data || []).length > 0;
      const hasNarrativeDrift = (drifts.data || []).length > 0;
      const hasLeadershipChange = (leadership.data || []).length > 0;

      return (hasFinancialStress && hasNarrativeDrift) ||
             (hasFinancialStress && hasLeadershipChange);
    },
  },
  {
    type: 'transaction_advisory',
    title: 'Transaction Advisory Opportunity',
    serviceLines: ['CDD', 'Transaction Advisory'],
    detect: async (companyId) => {
      // M&A activity + rising D/E
      const [deals, financials] = await Promise.all([
        supabase.from('intel_deals')
          .select('*').eq('company_id', companyId),
        supabase.from('intel_financial_signals')
          .select('*').eq('company_id', companyId)
          .eq('signal_type', 'balance_sheet_event'),
      ]);

      return (deals.data || []).length >= 2 || (financials.data || []).length > 0;
    },
  },
  {
    type: 'performance_improvement',
    title: 'Performance Improvement Opportunity',
    serviceLines: ['PEPI'],
    detect: async (companyId) => {
      // Below-median margin + cost escalation + management acknowledges gap
      const { data: signals } = await supabase
        .from('intel_signals')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'Negative')
        .in('severity', ['Critical', 'High']);

      const marginIssues = (signals || []).filter(s =>
        s.indicator?.toLowerCase().includes('margin') ||
        s.indicator?.toLowerCase().includes('cost') ||
        s.signal?.toLowerCase().includes('margin')
      );

      return marginIssues.length >= 2;
    },
  },
  {
    type: 'governance_risk',
    title: 'Governance Risk Flag',
    serviceLines: ['Disputes'],
    detect: async (companyId) => {
      // Audit flag + related party OR leadership churn
      const [leadership, signals] = await Promise.all([
        supabase.from('intel_leadership')
          .select('*').eq('company_id', companyId),
        supabase.from('intel_signals')
          .select('*').eq('company_id', companyId)
          .or('indicator.ilike.%fraud%,indicator.ilike.%audit%,indicator.ilike.%litigation%'),
      ]);

      const hasAuditFlag = (signals.data || []).some(s =>
        s.severity === 'Critical' || s.severity === 'High'
      );
      const hasLeadershipChurn = (leadership.data || []).length >= 2;

      return hasAuditFlag || hasLeadershipChurn;
    },
  },
];

async function detectCrossDimensionalPatterns() {
  const { data: companies, error } = await supabase
    .from('intel_companies')
    .select('id, name, ticker, sub_sector, am_signal');

  if (error) throw error;

  const signals = [];

  for (const company of companies || []) {
    for (const rule of PATTERN_RULES) {
      try {
        const matches = await rule.detect(company.id);
        if (matches) {
          signals.push({
            dimension: 'strategic', // cross-dimensional patterns
            signal_type: rule.type,
            severity: 'High',
            title: `${rule.title}: ${company.name}`,
            description: `Cross-dimensional pattern detected for ${company.name} (${company.ticker}). Potential service lines: ${rule.serviceLines.join(', ')}`,
            affected_companies: [company.id],
            primary_company_id: company.id,
            source_table: 'intel_sector_signals',
            pattern_type: rule.type,
            service_lines: rule.serviceLines,
          });
        }
      } catch (err) {
        console.error(`[Synthesis] Pattern ${rule.type} failed for ${company.name}:`, err.message);
      }
    }
  }

  return signals;
}

async function updateWatchlist() {
  // Re-score watchlist based on current signals
  const { data: watchlistEntries, error } = await supabase
    .from('intel_watchlist')
    .select('*, companies:intel_companies(name, ticker)');

  if (error) throw error;
  if (!watchlistEntries?.length) return 0;

  let updated = 0;
  for (const entry of watchlistEntries) {
    // Count critical/high signals for this company
    const { data: signals } = await supabase
      .from('intel_signals')
      .select('id, severity')
      .eq('company_id', entry.company_id)
      .in('severity', ['Critical', 'High']);

    const signalCount = (signals || []).length;
    const newScore = Math.min(5, Math.max(1, Math.ceil(signalCount / 2)));

    if (newScore !== entry.severity_score) {
      await supabase
        .from('intel_watchlist')
        .update({ severity_score: newScore })
        .eq('company_id', entry.company_id);
      updated++;
    }
  }

  return updated;
}

async function run() {
  console.log(`[SynthesisAdvisory] Starting cross-dimensional analysis`);

  try {
    const patterns = await detectCrossDimensionalPatterns();
    const watchlistUpdates = await updateWatchlist();

    if (patterns.length > 0) {
      await sectorSignalRepository.bulkInsert(patterns);
    }

    console.log(`[SynthesisAdvisory] ${patterns.length} patterns detected, ${watchlistUpdates} watchlist entries updated`);
    return { signals: patterns.length, watchlistUpdates };
  } catch (err) {
    console.error(`[SynthesisAdvisory] Failed:`, err.message);
    throw err;
  }
}

export default { run };
