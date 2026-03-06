import supabase from '../lib/supabase.js';

const companyRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_companies')
      .select('*, signal_taxonomy:intel_signal_taxonomy(*)')
      .order('name');
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('intel_companies')
      .select('*, signal_taxonomy:intel_signal_taxonomy(*), product_mix:intel_product_mix(*), premium_mix:intel_premium_mix(*)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async findByIdFull(id) {
    const { data: company, error: companyError } = await supabase
      .from('intel_companies')
      .select('*, signal_taxonomy:intel_signal_taxonomy(*), product_mix:intel_product_mix(*), premium_mix:intel_premium_mix(*)')
      .eq('id', id)
      .single();
    if (companyError) throw companyError;

    const [
      { data: signals, error: signalsError },
      { data: drifts, error: driftsError },
      { data: tvw, error: tvwError },
      { data: watchlist, error: watchlistError },
      { data: financials, error: financialsError },
      { data: scaleMatrix, error: scaleError },
    ] = await Promise.all([
      supabase
        .from('intel_signals')
        .select('*, signal_evidence:intel_signal_evidence(*)')
        .eq('company_id', id)
        .order('rank'),
      supabase
        .from('intel_narrative_drifts')
        .select('*')
        .eq('company_id', id),
      supabase
        .from('intel_talk_vs_walk')
        .select('*')
        .eq('company_id', id)
        .maybeSingle(),
      supabase
        .from('intel_watchlist')
        .select('*')
        .eq('company_id', id)
        .maybeSingle(),
      supabase
        .from('intel_financial_periods')
        .select('*')
        .eq('company_id', id)
        .order('fiscal_year', { ascending: false }),
      supabase
        .from('intel_scale_matrix')
        .select('*')
        .eq('company_id', id)
        .maybeSingle(),
    ]);

    if (signalsError) throw signalsError;
    if (driftsError) throw driftsError;
    if (tvwError) throw tvwError;
    if (watchlistError) throw watchlistError;
    if (financialsError) throw financialsError;
    if (scaleError) throw scaleError;

    return {
      ...company,
      signals,
      narrative_drifts: drifts,
      talk_vs_walk: tvw,
      watchlist: watchlist,
      financial_periods: financials,
      scale_matrix: scaleMatrix,
    };
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('intel_companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async upsertTaxonomy(companyId, taxonomy) {
    const { data, error } = await supabase
      .from('intel_signal_taxonomy')
      .upsert(
        { company_id: companyId, ...taxonomy },
        { onConflict: 'company_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async replaceProductMix(companyId, entries) {
    // Delete existing entries
    const { error: deleteError } = await supabase
      .from('intel_product_mix')
      .delete()
      .eq('company_id', companyId);
    if (deleteError) throw deleteError;

    // Insert new entries
    const rows = entries.map((e) => ({ company_id: companyId, ...e }));
    const { data, error } = await supabase
      .from('intel_product_mix')
      .insert(rows)
      .select();
    if (error) throw error;
    return data;
  },

  async upsertPremiumMix(companyId, mix) {
    const { data, error } = await supabase
      .from('intel_premium_mix')
      .upsert(
        { company_id: companyId, ...mix },
        { onConflict: 'company_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export default companyRepository;
