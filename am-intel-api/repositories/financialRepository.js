import supabase from '../lib/supabase.js';

const financialRepository = {
  async findAll() {
    const { data, error } = await supabase
      .from('intel_financial_periods')
      .select('*, companies:intel_companies(name, ticker, sub_sector)')
      .order('fiscal_year', { ascending: false })
      .order('quarter', { ascending: false });
    if (error) throw error;
    return data;
  },

  async findByCompany(companyId) {
    const { data, error } = await supabase
      .from('intel_financial_periods')
      .select('*')
      .eq('company_id', companyId)
      .order('fiscal_year', { ascending: false })
      .order('quarter', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getLatestQuarter() {
    // Get the latest quarter available across all companies
    const { data: latest, error: latestError } = await supabase
      .from('intel_financial_periods')
      .select('fiscal_year, quarter')
      .not('quarter', 'is', null)
      .order('fiscal_year', { ascending: false })
      .order('quarter', { ascending: false })
      .limit(1)
      .single();
    if (latestError) throw latestError;

    // Get all companies' data for that quarter
    const { data, error } = await supabase
      .from('intel_financial_periods')
      .select('*, companies:intel_companies(name, ticker, sub_sector)')
      .eq('fiscal_year', latest.fiscal_year)
      .eq('quarter', latest.quarter);
    if (error) throw error;
    return data;
  },
};

export default financialRepository;
