import supabase from '../lib/supabase.js';
import analystInteractionRepository from '../repositories/analystInteractionRepository.js';
import sectorSignalRepository from '../repositories/sectorSignalRepository.js';

const DIMENSION = 'transcript';

/**
 * Extends the existing intel_signals pipeline with analyst interaction analysis.
 * The core transcript signal extraction is handled by the /intel skill.
 * This agent adds:
 * - Analyst skepticism detection
 * - Management tone shift tracking
 * - Non-disclosure detection
 * - Guidance revision tracking
 */

async function detectAnalystSkepticism(companyId, signals) {
  // Look for signals with low credibility or defensive responses
  const skepticismSignals = signals.filter(s =>
    s.confidence === 'inferred' &&
    (s.severity === 'Critical' || s.severity === 'High') &&
    s.signal?.toLowerCase().includes('analyst')
  );

  return skepticismSignals.map(s => ({
    company_id: companyId,
    signal_type: 'analyst_skepticism',
    topic: s.indicator,
    question: s.rationale,
    response: s.signal,
    credibility_score: s.severity === 'Critical' ? 2 : 3,
    severity: s.severity,
    evidence: s.rationale,
    source_document: s.signal_evidence?.[0]?.source_document,
    period: s.time_period,
  }));
}

async function detectToneShifts(companyId) {
  // Compare narrative drifts for tone changes
  const { data: drifts, error } = await supabase
    .from('intel_narrative_drifts')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!drifts?.length) return [];

  return drifts
    .filter(d => d.shift_type && d.narrative_before && d.narrative_after)
    .map(d => ({
      company_id: companyId,
      signal_type: 'management_tone_shift',
      topic: d.topic,
      tone_before: d.narrative_before?.slice(0, 500),
      tone_after: d.narrative_after?.slice(0, 500),
      shift_type: mapDriftToToneShift(d.shift_type),
      severity: d.severity === 'critical' ? 'Critical' : d.severity === 'high' ? 'High' : 'Medium',
      evidence: `Shift type: ${d.shift_type}. Before: "${d.narrative_before?.slice(0, 100)}..." After: "${d.narrative_after?.slice(0, 100)}..."`,
      source_document: 'Earnings Call Transcripts',
    }));
}

function mapDriftToToneShift(driftShift) {
  const mapping = {
    retreat: 'confident_to_cautious',
    pivot: 'specific_to_vague',
    silence: 'proactive_to_defensive',
    reframe: 'specific_to_vague',
    stall: 'bullish_to_neutral',
    contradiction: 'confident_to_cautious',
    escalation: 'neutral_to_bearish',
  };
  return mapping[driftShift] || null;
}

async function detectNonDisclosures(companyId) {
  // Use existing absence signals
  const { data: absences, error } = await supabase
    .from('intel_absence_signals')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  if (!absences?.length) return [];

  return absences.map(a => ({
    company_id: companyId,
    signal_type: 'non_disclosure',
    metric_name: a.topic,
    significance: a.significance === 'critical' ? 'Critical' : a.significance === 'high' ? 'High' : 'Medium',
    severity: a.significance === 'critical' ? 'Critical' : a.significance === 'high' ? 'High' : 'Medium',
    evidence: `${a.topic}: ${a.context || ''} — ${a.implication || ''}`,
    source_document: 'Cross-quarter analysis',
  }));
}

async function run(companyId = null) {
  console.log(`[TranscriptIntel] Starting${companyId ? ` for company ${companyId}` : ' for all companies'}`);

  try {
    // Get companies to analyze
    let companyIds = [];
    if (companyId) {
      companyIds = [companyId];
    } else {
      const { data: companies, error } = await supabase
        .from('intel_companies')
        .select('id');
      if (error) throw error;
      companyIds = companies.map(c => c.id);
    }

    let totalSignals = 0;

    for (const cId of companyIds) {
      // Get existing signals for this company
      const { data: existingSignals, error: sigError } = await supabase
        .from('intel_signals')
        .select('*, signal_evidence:intel_signal_evidence(*)')
        .eq('company_id', cId)
        .order('rank');
      if (sigError) throw sigError;

      const interactions = [
        ...await detectAnalystSkepticism(cId, existingSignals || []),
        ...await detectToneShifts(cId),
        ...await detectNonDisclosures(cId),
      ];

      if (interactions.length === 0) continue;

      // Write to analyst interactions table
      const rows = await analystInteractionRepository.bulkInsert(interactions);

      // Write to sector signal index
      const sectorSignals = rows.map(row => ({
        dimension: DIMENSION,
        signal_type: row.signal_type,
        severity: row.severity,
        title: `${row.signal_type.replace(/_/g, ' ')}: ${row.topic || row.metric_name || ''}`,
        description: row.evidence,
        affected_companies: [cId],
        primary_company_id: cId,
        source_table: 'intel_analyst_interactions',
        source_id: row.id,
        period: row.period,
      }));

      await sectorSignalRepository.bulkInsert(sectorSignals);
      totalSignals += interactions.length;
    }

    console.log(`[TranscriptIntel] Detected ${totalSignals} transcript intelligence signals`);
    return { signals: totalSignals };
  } catch (err) {
    console.error(`[TranscriptIntel] Failed:`, err.message);
    throw err;
  }
}

export default { run };
