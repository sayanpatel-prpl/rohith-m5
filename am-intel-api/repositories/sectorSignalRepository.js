import supabase from '../lib/supabase.js';

const sectorSignalRepository = {
  async findAll(filters = {}) {
    let query = supabase
      .from('intel_sector_signals')
      .select('*')
      .order('detected_at', { ascending: false });

    if (filters.dimension) query = query.eq('dimension', filters.dimension);
    if (filters.severity) query = query.eq('severity', filters.severity);
    if (filters.signal_type) query = query.eq('signal_type', filters.signal_type);
    if (filters.pattern_type) query = query.eq('pattern_type', filters.pattern_type);
    if (filters.primary_company_id) query = query.eq('primary_company_id', filters.primary_company_id);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async findByCompany(companyId) {
    const { data, error } = await supabase
      .from('intel_sector_signals')
      .select('*')
      .contains('affected_companies', [companyId])
      .order('detected_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findByDimension(dimension) {
    const { data, error } = await supabase
      .from('intel_sector_signals')
      .select('*')
      .eq('dimension', dimension)
      .order('detected_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findPatterns(filters = {}) {
    let query = supabase
      .from('intel_sector_signals')
      .select('*')
      .not('pattern_type', 'is', null)
      .order('detected_at', { ascending: false });

    if (filters.pattern_type) query = query.eq('pattern_type', filters.pattern_type);
    if (filters.severity) query = query.eq('severity', filters.severity);
    if (filters.limit) query = query.limit(filters.limit);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async insert(signal) {
    const { data, error } = await supabase
      .from('intel_sector_signals')
      .insert(signal)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async bulkInsert(signals) {
    if (!signals.length) return [];
    const { data, error } = await supabase
      .from('intel_sector_signals')
      .insert(signals)
      .select();
    if (error) throw error;
    return data;
  },
};

export default sectorSignalRepository;
