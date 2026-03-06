import supabase from '../lib/supabase.js';

const competitiveRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_competitive_moves')
      .select('*, companies:intel_companies(name, ticker)')
      .order('move_date', { ascending: false });

    if (filters.move_type) {
      query = query.eq('move_type', filters.move_type);
    }
    if (filters.impact) {
      query = query.eq('impact', filters.impact);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};

export default competitiveRepository;
