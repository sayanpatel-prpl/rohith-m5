import supabase from '../lib/supabase.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

const DIMENSION = 'sector';

/**
 * Sector/Macro Agent — Monitors industry trends, channel disruption,
 * commodity shocks, policy changes from intel_market_pulse table.
 */

async function detectMarketPulseSignals() {
  const { data: pulses, error } = await supabase
    .from('intel_market_pulse')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!pulses?.length) return [];

  return pulses.map(p => {
    // Determine severity from tier and direction
    let severity = 'Medium';
    if (p.tier === 1) severity = 'Critical';
    else if (p.tier === 2) severity = 'High';
    else if (p.tier === 3) severity = 'Medium';

    // Parse affected companies
    const affected = (p.affected_companies || '')
      .split(',')
      .map(c => c.trim())
      .filter(Boolean);

    // Determine signal type from category
    let signalType = 'industry_trend';
    const category = (p.category || '').toLowerCase();
    if (category.includes('commodity') || category.includes('input cost')) {
      signalType = 'commodity_shock';
    } else if (category.includes('channel') || category.includes('distribution')) {
      signalType = 'channel_disruption';
    } else if (category.includes('policy') || category.includes('regulation') || category.includes('bee') || category.includes('pli')) {
      signalType = 'policy_change';
    } else if (category.includes('technology') || category.includes('digital')) {
      signalType = 'technology_disruption';
    } else if (category.includes('weather') || category.includes('seasonal') || category.includes('monsoon')) {
      signalType = 'weather_seasonal';
    }

    return {
      dimension: DIMENSION,
      signal_type: signalType,
      severity,
      title: p.title,
      description: `${p.direction || ''} — ${p.headline_value || ''} — ${p.badge || ''}`.trim(),
      affected_companies: affected,
      source_table: 'intel_market_pulse',
      source_id: p.id,
    };
  });
}

async function detectSubSectorThemes() {
  // Look for patterns affecting entire sub-sectors
  const { data: companies, error } = await supabase
    .from('intel_companies')
    .select('id, name, sub_sector');

  if (error) throw error;

  // Group by sub-sector
  const bySubSector = {};
  for (const company of companies || []) {
    if (!bySubSector[company.sub_sector]) bySubSector[company.sub_sector] = [];
    bySubSector[company.sub_sector].push(company);
  }

  const signals = [];

  for (const [subSector, companies] of Object.entries(bySubSector)) {
    if (companies.length < 2) continue;

    // Check if multiple companies in same sub-sector have critical signals
    const companyIds = companies.map(c => c.id);
    const { data: criticalSignals, error: sigError } = await supabase
      .from('intel_signals')
      .select('company_id, severity')
      .in('company_id', companyIds)
      .in('severity', ['Critical', 'High']);

    if (sigError) continue;

    const companiesWithCritical = [...new Set((criticalSignals || []).map(s => s.company_id))];

    if (companiesWithCritical.length >= 2) {
      signals.push({
        dimension: DIMENSION,
        signal_type: 'sub_sector_stress',
        severity: companiesWithCritical.length >= 3 ? 'High' : 'Medium',
        title: `${subSector} sub-sector stress: ${companiesWithCritical.length}/${companies.length} companies with critical signals`,
        description: `Companies affected: ${companies.filter(c => companiesWithCritical.includes(c.id)).map(c => c.name).join(', ')}`,
        affected_companies: companiesWithCritical,
        source_table: 'intel_signals',
        pattern_type: 'sector_theme',
      });
    }
  }

  return signals;
}

async function run() {
  console.log(`[SectorMacro] Starting analysis`);

  try {
    const signals = [
      ...await detectMarketPulseSignals(),
      ...await detectSubSectorThemes(),
    ];

    if (signals.length === 0) {
      console.log(`[SectorMacro] No sector/macro signals detected`);
      return { signals: 0 };
    }

    await sectorSignalRepository.bulkInsert(signals);

    console.log(`[SectorMacro] Detected ${signals.length} sector/macro signals`);
    return { signals: signals.length };
  } catch (err) {
    console.error(`[SectorMacro] Failed:`, err.message);
    throw err;
  }
}

export default { run };
