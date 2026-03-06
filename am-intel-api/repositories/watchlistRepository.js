import supabase from '../lib/supabase.js';

const watchlistRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_watchlist')
      .select('*, companies:intel_companies(name, ticker, sub_sector, am_signal)')
      .order('severity_score', { ascending: false });
    if (error) throw error;
    return data;
  },
};

export default watchlistRepository;
