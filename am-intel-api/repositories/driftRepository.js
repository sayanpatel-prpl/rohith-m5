import supabase from '../lib/supabase.js';

const driftRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_narrative_drifts')
      .select('*, companies:intel_companies(name, ticker)')
      .order('severity')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findByCompany(companyId) {
    const { data, error } = await supabase
      .from('intel_narrative_drifts')
      .select('*')
      .eq('company_id', companyId)
      .order('severity');
    if (error) throw error;
    return data;
  },
};

export default driftRepository;
