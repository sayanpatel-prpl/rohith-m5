import supabase from '../lib/supabase.js';

const analystInteractionRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_analyst_interactions')
      .select('*, companies:intel_companies(name, ticker)')
      .order('detected_at', { ascending: false });

    if (filters.signal_type) query = query.eq('signal_type', filters.signal_type);
    if (filters.severity) query = query.eq('severity', filters.severity);
    if (filters.company_id) query = query.eq('company_id', filters.company_id);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findByCompany(companyId) {
    const { data, error } = await supabase
      .from('intel_analyst_interactions')
      .select('*')
      .eq('company_id', companyId)
      .order('detected_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async insert(interaction) {
    const { data, error } = await supabase
      .from('intel_analyst_interactions')
      .insert(interaction)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async bulkInsert(interactions) {
    if (!interactions.length) return [];
    const { data, error } = await supabase
      .from('intel_analyst_interactions')
      .insert(interactions)
      .select();
    if (error) throw error;
    return data;
  },
};

export default analystInteractionRepository;
