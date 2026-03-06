import supabase from '../lib/supabase.js';

const dealRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_deals')
      .select('*, companies:intel_companies(name, ticker)')
      .order('deal_date', { ascending: false });

    if (filters.deal_type) {
      query = query.eq('deal_type', filters.deal_type);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

export default dealRepository;
