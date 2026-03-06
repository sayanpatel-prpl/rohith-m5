import supabase from '../lib/supabase.js';

const talkVsWalkRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_talk_vs_walk')
      .select('*, companies:intel_companies(name, ticker)')
      .order('badge');
    if (error) throw error;
    return data;
  },

  async upsert(companyId, entry) {
    const { data, error } = await supabase
      .from('intel_talk_vs_walk')
      .upsert(
        { company_id: companyId, ...entry },
        { onConflict: 'company_id' }
      )
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

export default talkVsWalkRepository;
