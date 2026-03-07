import supabase from '../lib/supabase.js';
import financialSignalRepository from '../repositories/financialSignalRepository.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

const DIMENSION = 'financial';

// Thresholds for signal detection
const THRESHOLDS = {
  revenue_decel_bps: 500,       // >500bps revenue deceleration
  margin_compress_bps: 100,     // >100bps margin compression
  roce_decline_bps: 200,        // >200bps ROCE decline
  pe_premium_pct: 30,           // >30% PE premium/discount vs sector
  guidance_variance_pct: 10,    // >10% guidance miss
};

function classifySeverity(signalType, delta) {
  const abs = Math.abs(delta || 0);
  if (signalType === 'revenue_trajectory') {
    if (abs >= 1500) return 'Critical';
    if (abs >= 500) return 'High';
    return 'Medium';
  }
  if (signalType === 'margin_dynamics') {
    if (abs >= 300) return 'Critical';
    if (abs >= 100) return 'High';
    return 'Medium';
  }
  if (signalType === 'capital_efficiency') {
    if (abs >= 500) return 'Critical';
    if (abs >= 200) return 'High';
    return 'Medium';
  }
  return 'Medium';
}

async function getAllFinancials() {
  const { data, error } = await supabase
    .from('intel_financial_periods')
    .select('*, companies:intel_companies(name, ticker, sub_sector)')
    .order('fiscal_year', { ascending: false })
    .order('quarter', { ascending: false });
  if (error) throw error;
  return data;
}

async function computeSectorMedians(financials) {
  const latestByCompany = {};
  for (const f of financials) {
    if (!latestByCompany[f.company_id]) {
      latestByCompany[f.company_id] = f;
    }
  }

  const latest = Object.values(latestByCompany);
  const values = {
    rev_growth: latest.map(f => f.rev_growth).filter(v => v != null).sort((a, b) => a - b),
    ebitda_pct: latest.map(f => f.ebitda_pct).filter(v => v != null).sort((a, b) => a - b),
    roce: latest.map(f => f.roce).filter(v => v != null).sort((a, b) => a - b),
    pe: latest.map(f => f.pe).filter(v => v != null).sort((a, b) => a - b),
    de: latest.map(f => f.de).filter(v => v != null).sort((a, b) => a - b),
  };

  const median = arr => arr.length ? arr[Math.floor(arr.length / 2)] : null;

  return {
    rev_growth: median(values.rev_growth),
    ebitda_pct: median(values.ebitda_pct),
    roce: median(values.roce),
    pe: median(values.pe),
    de: median(values.de),
  };
}

async function detectRevenueTrajectory(companyId, financials, sectorMedians) {
  const signals = [];
  const companyData = financials.filter(f => f.company_id === companyId);
  if (companyData.length < 2) return signals;

  const [latest, prior] = companyData;
  if (latest.rev_growth == null || prior.rev_growth == null) return signals;

  const decelBps = (prior.rev_growth - latest.rev_growth) * 100;

  if (Math.abs(decelBps) >= THRESHOLDS.revenue_decel_bps) {
    signals.push({
      company_id: companyId,
      signal_type: 'revenue_trajectory',
      severity: classifySeverity('revenue_trajectory', decelBps),
      current_value: latest.rev_growth,
      prior_value: prior.rev_growth,
      change_pct: latest.rev_growth - prior.rev_growth,
      benchmark_value: sectorMedians.rev_growth,
      period: `${latest.quarter || 'FY'} ${latest.fiscal_year}`,
      evidence: `Revenue growth ${decelBps > 0 ? 'decelerated' : 'accelerated'} by ${Math.abs(Math.round(decelBps))}bps (${prior.rev_growth}% → ${latest.rev_growth}%)`,
    });
  }

  return signals;
}

async function detectMarginDynamics(companyId, financials, sectorMedians) {
  const signals = [];
  const companyData = financials.filter(f => f.company_id === companyId);
  if (companyData.length < 2) return signals;

  const [latest, prior] = companyData;
  if (latest.ebitda_pct == null || prior.ebitda_pct == null) return signals;

  const deltaBps = (latest.ebitda_pct - prior.ebitda_pct) * 100;

  if (Math.abs(deltaBps) >= THRESHOLDS.margin_compress_bps) {
    signals.push({
      company_id: companyId,
      signal_type: 'margin_dynamics',
      severity: classifySeverity('margin_dynamics', deltaBps),
      margin_type: 'ebitda',
      current_value: latest.ebitda_pct,
      prior_value: prior.ebitda_pct,
      delta_bps: Math.round(deltaBps),
      benchmark_value: sectorMedians.ebitda_pct,
      period: `${latest.quarter || 'FY'} ${latest.fiscal_year}`,
      evidence: `EBITDA margin ${deltaBps > 0 ? 'expanded' : 'compressed'} by ${Math.abs(Math.round(deltaBps))}bps (${prior.ebitda_pct}% → ${latest.ebitda_pct}%)`,
    });
  }

  return signals;
}

async function detectCapitalEfficiency(companyId, financials, sectorMedians) {
  const signals = [];
  const companyData = financials.filter(f => f.company_id === companyId);
  if (companyData.length < 2) return signals;

  const [latest, prior] = companyData;
  if (latest.roce == null || prior.roce == null) return signals;

  const deltaBps = (latest.roce - prior.roce) * 100;

  if (Math.abs(deltaBps) >= THRESHOLDS.roce_decline_bps) {
    const sectorAvg = sectorMedians.roce;
    const rank = financials
      .filter(f => f.roce != null)
      .map(f => ({ id: f.company_id, roce: f.roce }))
      .sort((a, b) => b.roce - a.roce)
      .findIndex(f => f.id === companyId) + 1;

    signals.push({
      company_id: companyId,
      signal_type: 'capital_efficiency',
      severity: classifySeverity('capital_efficiency', deltaBps),
      metric: 'ROCE',
      current_value: latest.roce,
      prior_value: prior.roce,
      change_pct: latest.roce - prior.roce,
      sector_avg: sectorAvg,
      rank,
      period: `${latest.quarter || 'FY'} ${latest.fiscal_year}`,
      evidence: `ROCE ${deltaBps > 0 ? 'improved' : 'declined'} by ${Math.abs(Math.round(deltaBps))}bps (${prior.roce}% → ${latest.roce}%). Sector median: ${sectorAvg}%. Rank: ${rank}/16`,
    });
  }

  return signals;
}

async function detectValuationAnomaly(companyId, financials, sectorMedians) {
  const signals = [];
  const companyData = financials.filter(f => f.company_id === companyId);
  if (!companyData.length) return signals;

  const latest = companyData[0];
  if (latest.pe == null || sectorMedians.pe == null) return signals;

  const premiumDiscount = ((latest.pe - sectorMedians.pe) / sectorMedians.pe) * 100;

  if (Math.abs(premiumDiscount) >= THRESHOLDS.pe_premium_pct) {
    signals.push({
      company_id: companyId,
      signal_type: 'valuation_anomaly',
      severity: 'Medium',
      pe_ratio: latest.pe,
      sector_pe: sectorMedians.pe,
      premium_discount_pct: Math.round(premiumDiscount * 10) / 10,
      period: `${latest.quarter || 'FY'} ${latest.fiscal_year}`,
      evidence: `PE ratio ${latest.pe}x vs sector median ${sectorMedians.pe}x (${premiumDiscount > 0 ? '+' : ''}${Math.round(premiumDiscount)}% ${premiumDiscount > 0 ? 'premium' : 'discount'})`,
    });
  }

  return signals;
}

async function detectWorkingCapitalStress(companyId, financials) {
  const signals = [];
  const companyData = financials.filter(f => f.company_id === companyId);
  if (companyData.length < 2) return signals;

  const [latest, prior] = companyData;
  if (latest.wc_days == null || prior.wc_days == null) return signals;

  const wcIncrease = latest.wc_days - prior.wc_days;
  if (wcIncrease > 15) {  // >15 days increase = stress signal
    signals.push({
      company_id: companyId,
      signal_type: 'working_capital_stress',
      severity: wcIncrease > 30 ? 'High' : 'Medium',
      wc_days: latest.wc_days,
      current_value: latest.wc_days,
      prior_value: prior.wc_days,
      period: `${latest.quarter || 'FY'} ${latest.fiscal_year}`,
      evidence: `Working capital days increased from ${prior.wc_days} to ${latest.wc_days} (+${Math.round(wcIncrease)} days)`,
    });
  }

  return signals;
}

/**
 * Run financial analyst agent for all companies
 */
async function run() {
  console.log(`[FinancialAnalyst] Starting analysis across all companies`);

  try {
    const financials = await getAllFinancials();
    if (!financials.length) {
      console.log(`[FinancialAnalyst] No financial data available`);
      return { signals: 0 };
    }

    const sectorMedians = await computeSectorMedians(financials);
    const companyIds = [...new Set(financials.map(f => f.company_id))];

    let allSignals = [];
    for (const companyId of companyIds) {
      const signals = [
        ...await detectRevenueTrajectory(companyId, financials, sectorMedians),
        ...await detectMarginDynamics(companyId, financials, sectorMedians),
        ...await detectCapitalEfficiency(companyId, financials, sectorMedians),
        ...await detectValuationAnomaly(companyId, financials, sectorMedians),
        ...await detectWorkingCapitalStress(companyId, financials),
      ];
      allSignals.push(...signals);
    }

    if (allSignals.length === 0) {
      console.log(`[FinancialAnalyst] No significant financial signals detected`);
      return { signals: 0 };
    }

    // Write to financial signals table
    const domainRows = await financialSignalRepository.bulkInsert(allSignals);

    // Write to sector signal index
    const sectorSignals = domainRows.map(row => ({
      dimension: DIMENSION,
      signal_type: row.signal_type,
      severity: row.severity,
      title: `${row.signal_type.replace(/_/g, ' ')}: ${row.evidence?.slice(0, 100)}`,
      description: row.evidence,
      affected_companies: [row.company_id],
      primary_company_id: row.company_id,
      source_table: 'intel_financial_signals',
      source_id: row.id,
      period: row.period,
    }));

    await sectorSignalRepository.bulkInsert(sectorSignals);

    console.log(`[FinancialAnalyst] Detected ${allSignals.length} financial signals across ${companyIds.length} companies`);
    return { signals: allSignals.length };
  } catch (err) {
    console.error(`[FinancialAnalyst] Failed:`, err.message);
    throw err;
  }
}

export default { run };
