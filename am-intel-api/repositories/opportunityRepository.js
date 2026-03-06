import supabase from '../lib/supabase.js';

const opportunityRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_opportunities')
      .select('*, sub_opportunities:intel_sub_opportunities(*), companies:intel_companies(name, ticker)')
      .order('account');

    if (filters.stage) {
      query = query.eq('stage', filters.stage);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

export default opportunityRepository;
