import supabase from '../lib/supabase.js';

const themeRepository = {
  async findAllWithEvidence() {
    const { data, error } = await supabase
      .from('intel_themes')
      .select('*, theme_evidence:intel_theme_evidence(*, companies:intel_companies(name, ticker))')
      .order('title');
    if (error) throw error;
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('intel_themes')
      .select('*, theme_evidence:intel_theme_evidence(*, companies:intel_companies(name, ticker))')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};

export default themeRepository;
