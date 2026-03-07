import supabase from '../lib/supabase.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

const DIMENSION = 'strategic';

/**
 * Strategic Moves Agent — Monitors M&A, competitive moves, market share, pricing actions.
 * Reads from existing intel_deals, intel_competitive_moves tables and writes sector signals.
 */

async function detectMnAPatterns() {
  const { data: deals, error } = await supabase
    .from('intel_deals')
    .select('*, companies:intel_companies(name, ticker, sub_sector)')
    .order('deal_date', { ascending: false });

  if (error) throw error;
  if (!deals?.length) return [];

  // Group deals by company to detect serial acquirers
  const byCompany = {};
  for (const deal of deals) {
    if (!byCompany[deal.company_id]) byCompany[deal.company_id] = [];
    byCompany[deal.company_id].push(deal);
  }

  const signals = [];

  for (const [companyId, companyDeals] of Object.entries(byCompany)) {
    // Serial acquirer: 2+ deals
    if (companyDeals.length >= 2) {
      const totalValue = companyDeals.reduce((sum, d) => sum + (d.value_cr || 0), 0);
      signals.push({
        dimension: DIMENSION,
        signal_type: 'ma_activity',
        severity: companyDeals.length >= 3 ? 'High' : 'Medium',
        title: `Serial acquirer: ${companyDeals.length} deals${totalValue ? ` totaling Rs ${totalValue} Cr` : ''}`,
        description: companyDeals.map(d => `${d.title} (${d.deal_type})`).join('; '),
        affected_companies: [companyId],
        primary_company_id: companyId,
        source_table: 'intel_deals',
        source_id: companyDeals[0].id,
        service_lines: ['CDD', 'Transaction Advisory'],
      });
    }
  }

  return signals;
}

async function detectCompetitivePatterns() {
  const { data: moves, error } = await supabase
    .from('intel_competitive_moves')
    .select('*, companies:intel_companies(name, ticker, sub_sector)')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!moves?.length) return [];

  // Detect cross-company patterns (same move type across companies)
  const byType = {};
  for (const move of moves) {
    if (!byType[move.move_type]) byType[move.move_type] = [];
    byType[move.move_type].push(move);
  }

  const signals = [];

  for (const [moveType, typeMoves] of Object.entries(byType)) {
    const uniqueCompanies = [...new Set(typeMoves.map(m => m.company_id))];

    // Sector theme: 3+ companies with same move type
    if (uniqueCompanies.length >= 3) {
      signals.push({
        dimension: DIMENSION,
        signal_type: 'sector_pattern',
        severity: 'High',
        title: `Sector-wide ${moveType}: ${uniqueCompanies.length} companies`,
        description: typeMoves.map(m => `${m.companies?.name}: ${m.title || m.description?.slice(0, 100)}`).join('; '),
        affected_companies: uniqueCompanies,
        primary_company_id: uniqueCompanies[0],
        source_table: 'intel_competitive_moves',
        source_id: typeMoves[0].id,
        pattern_type: 'sector_theme',
      });
    }
  }

  return signals;
}

async function detectPricingActions() {
  const { data: moves, error } = await supabase
    .from('intel_competitive_moves')
    .select('*, companies:intel_companies(name, ticker)')
    .eq('move_type', 'Pricing')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!moves?.length) return [];

  return moves.map(m => ({
    dimension: DIMENSION,
    signal_type: 'pricing_action',
    severity: m.impact === 'High' ? 'High' : 'Medium',
    title: `Pricing action: ${m.companies?.name} — ${m.title || m.description?.slice(0, 80)}`,
    description: m.description,
    affected_companies: [m.company_id],
    primary_company_id: m.company_id,
    source_table: 'intel_competitive_moves',
    source_id: m.id,
  }));
}

async function run() {
  console.log(`[StrategicMoves] Starting analysis`);

  try {
    const signals = [
      ...await detectMnAPatterns(),
      ...await detectCompetitivePatterns(),
      ...await detectPricingActions(),
    ];

    if (signals.length === 0) {
      console.log(`[StrategicMoves] No strategic signals detected`);
      return { signals: 0 };
    }

    await sectorSignalRepository.bulkInsert(signals);

    console.log(`[StrategicMoves] Detected ${signals.length} strategic signals`);
    return { signals: signals.length };
  } catch (err) {
    console.error(`[StrategicMoves] Failed:`, err.message);
    throw err;
  }
}

export default { run };
