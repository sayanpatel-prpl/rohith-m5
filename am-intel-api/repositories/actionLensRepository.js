import supabase from '../lib/supabase.js';

const actionLensRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_action_lens')
      .select('*, companies:intel_companies(name, ticker)')
      .order('sort_order')
      .order('persona');

    if (filters.persona) {
      query = query.eq('persona', filters.persona);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

export default actionLensRepository;
