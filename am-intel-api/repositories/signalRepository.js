import supabase from '../lib/supabase.js';

const signalRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_signals')
      .select('*, companies:intel_companies(name, ticker), signal_evidence:intel_signal_evidence(*)')
      .order('rank');

    if (filters.severity) {
      query = query.eq('severity', filters.severity);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.confidence) {
      query = query.eq('confidence', filters.confidence);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findByCompany(companyId) {
    const { data, error } = await supabase
      .from('intel_signals')
      .select('*, signal_evidence:intel_signal_evidence(*)')
      .eq('company_id', companyId)
      .order('rank');
    if (error) throw error;
    return data;
  },

  async findEvidence(signalId) {
    const { data, error } = await supabase
      .from('intel_signal_evidence')
      .select('*')
      .eq('signal_id', signalId);
    if (error) throw error;
    return data;
  },

  async bulkInsert(companyId, signals) {
    const results = [];

    for (const signal of signals) {
      const { evidence, ...signalData } = signal;

      // Insert the signal
      const { data: insertedSignal, error: signalError } = await supabase
        .from('intel_signals')
        .insert({ company_id: companyId, ...signalData })
        .select()
        .single();
      if (signalError) throw signalError;

      // Insert evidence if provided
      let insertedEvidence = [];
      if (evidence && evidence.length > 0) {
        const evidenceRows = evidence.map((e) => ({
          signal_id: insertedSignal.id,
          ...e,
        }));
        const { data: evData, error: evError } = await supabase
          .from('intel_signal_evidence')
          .insert(evidenceRows)
          .select();
        if (evError) throw evError;
        insertedEvidence = evData;
      }

      results.push({ ...insertedSignal, signal_evidence: insertedEvidence });
    }

    return results;
  },
};

export default signalRepository;
