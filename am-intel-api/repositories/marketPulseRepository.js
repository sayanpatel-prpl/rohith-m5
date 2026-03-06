import supabase from '../lib/supabase.js';

const marketPulseRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_market_pulse')
      .select('*')
      .order('sort_order')
      .order('category');
    if (error) throw error;
    return data;
  },
};

export default marketPulseRepository;
