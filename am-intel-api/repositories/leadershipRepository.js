import supabase from '../lib/supabase.js';

const leadershipRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_leadership')
      .select('*, companies:intel_companies(name, ticker)')
      .order('risk_score', { ascending: false })
      .order('event_date', { ascending: false });
    if (error) throw error;
    return data;
  },
};

export default leadershipRepository;
