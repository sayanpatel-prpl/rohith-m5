import supabase from '../lib/supabase.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

const DIMENSION = 'governance';

/**
 * Governance Risk Agent — Detects leadership instability, audit flags,
 * related party alerts from existing intel_leadership table.
 */

async function detectLeadershipInstability() {
  const { data: events, error } = await supabase
    .from('intel_leadership')
    .select('*, companies:intel_companies(name, ticker)')
    .order('event_date', { ascending: false });

  if (error) throw error;
  if (!events?.length) return [];

  // Group by company
  const byCompany = {};
  for (const event of events) {
    if (!byCompany[event.company_id]) byCompany[event.company_id] = [];
    byCompany[event.company_id].push(event);
  }

  const signals = [];

  for (const [companyId, companyEvents] of Object.entries(byCompany)) {
    // High risk alerts
    const highRisk = companyEvents.filter(e => e.risk_score >= 4);
    if (highRisk.length > 0) {
      for (const event of highRisk) {
        signals.push({
          dimension: DIMENSION,
          signal_type: 'leadership_change',
          severity: event.risk_score >= 5 ? 'Critical' : 'High',
          title: `${event.alert_type}: ${event.companies?.name}`,
          description: `Risk score: ${event.risk_score}/5. ${event.alert_type}`,
          affected_companies: [companyId],
          primary_company_id: companyId,
          source_table: 'intel_leadership',
          source_id: event.id,
          service_lines: ['Interim Management'],
        });
      }
    }

    // Leadership instability: 2+ changes in 12 months
    if (companyEvents.length >= 2) {
      signals.push({
        dimension: DIMENSION,
        signal_type: 'leadership_instability',
        severity: companyEvents.length >= 3 ? 'Critical' : 'High',
        title: `Leadership instability: ${companyEvents.length} changes at ${companyEvents[0]?.companies?.name}`,
        description: companyEvents.map(e => e.alert_type).join('; '),
        affected_companies: [companyId],
        primary_company_id: companyId,
        source_table: 'intel_leadership',
        source_id: companyEvents[0].id,
        pattern_type: 'governance_risk',
        service_lines: ['Interim Management', 'Turnaround'],
      });
    }
  }

  return signals;
}

async function detectGovernanceFlags() {
  // Look for signals in intel_signals that indicate governance issues
  const { data: signals, error } = await supabase
    .from('intel_signals')
    .select('*, companies:intel_companies(name, ticker)')
    .or('indicator.ilike.%audit%,indicator.ilike.%fraud%,indicator.ilike.%compliance%,indicator.ilike.%related party%,indicator.ilike.%litigation%')
    .order('rank');

  if (error) throw error;
  if (!signals?.length) return [];

  return signals
    .filter(s => s.severity === 'Critical' || s.severity === 'High')
    .map(s => ({
      dimension: DIMENSION,
      signal_type: 'governance_flag',
      severity: s.severity,
      title: `Governance flag: ${s.companies?.name} — ${s.indicator}`,
      description: s.signal,
      affected_companies: [s.company_id],
      primary_company_id: s.company_id,
      source_table: 'intel_signals',
      source_id: s.id,
      service_lines: ['Disputes'],
    }));
}

async function run() {
  console.log(`[GovernanceRisk] Starting analysis`);

  try {
    const signals = [
      ...await detectLeadershipInstability(),
      ...await detectGovernanceFlags(),
    ];

    if (signals.length === 0) {
      console.log(`[GovernanceRisk] No governance signals detected`);
      return { signals: 0 };
    }

    await sectorSignalRepository.bulkInsert(signals);

    console.log(`[GovernanceRisk] Detected ${signals.length} governance signals`);
    return { signals: signals.length };
  } catch (err) {
    console.error(`[GovernanceRisk] Failed:`, err.message);
    throw err;
  }
}

export default { run };
