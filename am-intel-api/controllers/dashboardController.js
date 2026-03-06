import supabase from '../lib/supabase.js';

const dashboardController = {
  /**
   * GET /dashboard/executive-snapshot
   * Companies with taxonomy + themes + red flags (critical/high signals) + TVW + latest financials
   */
  async executiveSnapshot(req, res) {
    try {
      const [
        { data: companies, error: compErr },
        { data: themes, error: themeErr },
        { data: tvw, error: tvwErr },
        { data: redFlags, error: rfErr },
        { data: financials, error: finErr },
      ] = await Promise.all([
        supabase
          .from('intel_companies')
          .select('*, signal_taxonomy:intel_signal_taxonomy(*)')
          .order('name'),
        supabase
          .from('intel_themes')
          .select('*, theme_evidence:intel_theme_evidence(*, companies:intel_companies(name, ticker))')
          .order('title'),
        supabase
          .from('intel_talk_vs_walk')
          .select('*, companies:intel_companies(name, ticker)')
          .order('badge'),
        supabase
          .from('intel_signals')
          .select('*, companies:intel_companies(name, ticker)')
          .in('severity', ['Critical', 'High'])
          .order('severity')
          .order('rank'),
        supabase
          .from('intel_financial_periods')
          .select('*, companies:intel_companies(name, ticker, sub_sector)')
          .not('quarter', 'is', null)
          .order('fiscal_year', { ascending: false })
          .order('quarter', { ascending: false }),
      ]);

      if (compErr) throw compErr;
      if (themeErr) throw themeErr;
      if (tvwErr) throw tvwErr;
      if (rfErr) throw rfErr;
      if (finErr) throw finErr;

      // Build earnings grid: latest quarter per company
      const earningsGrid = {};
      for (const row of financials) {
        if (!earningsGrid[row.company_id]) {
          earningsGrid[row.company_id] = row;
        }
      }

      res.json({
        data: {
          companies,
          themes,
          talk_vs_walk: tvw,
          red_flags: redFlags,
          earnings_grid: Object.values(earningsGrid),
        },
      });
    } catch (error) {
      console.error('dashboard.executiveSnapshot error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * GET /dashboard/financial-performance
   * All financial periods + company meta for the sortable table
   */
  async financialPerformance(req, res) {
    try {
      const [
        { data: financials, error: finErr },
        { data: companies, error: compErr },
      ] = await Promise.all([
        supabase
          .from('intel_financial_periods')
          .select('*, companies:intel_companies(name, ticker, sub_sector, am_signal, perf)')
          .order('fiscal_year', { ascending: false })
          .order('quarter', { ascending: false }),
        supabase
          .from('intel_companies')
          .select('id, name, ticker, sub_sector, am_signal, perf')
          .order('name'),
      ]);

      if (finErr) throw finErr;
      if (compErr) throw compErr;

      res.json({
        data: {
          financial_periods: financials,
          companies,
        },
      });
    } catch (error) {
      console.error('dashboard.financialPerformance error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * GET /dashboard/transcript-intel
   * Signals grouped by company with evidence + stats (count by severity, by company)
   */
  async transcriptIntel(req, res) {
    try {
      const { data: signals, error: sigErr } = await supabase
        .from('intel_signals')
        .select('*, companies:intel_companies(name, ticker), signal_evidence:intel_signal_evidence(*)')
        .order('company_id')
        .order('rank');

      if (sigErr) throw sigErr;

      // Group by company
      const byCompany = {};
      const bySeverity = {};
      for (const sig of signals) {
        // Group by company
        const cid = sig.company_id;
        if (!byCompany[cid]) {
          byCompany[cid] = {
            company_id: cid,
            company: sig.companies,
            signals: [],
          };
        }
        byCompany[cid].signals.push(sig);

        // Count by severity
        bySeverity[sig.severity] = (bySeverity[sig.severity] || 0) + 1;
      }

      res.json({
        data: {
          by_company: Object.values(byCompany),
          stats: {
            total: signals.length,
            by_severity: bySeverity,
            company_count: Object.keys(byCompany).length,
          },
        },
      });
    } catch (error) {
      console.error('dashboard.transcriptIntel error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * GET /dashboard/sub-sector-deep-dive
   * Companies with product_mix + premium_mix + scale_matrix
   */
  async subSectorDeepDive(req, res) {
    try {
      const [
        { data: companies, error: compErr },
        { data: scaleMatrix, error: scaleErr },
      ] = await Promise.all([
        supabase
          .from('intel_companies')
          .select('*, product_mix:intel_product_mix(*), premium_mix:intel_premium_mix(*), signal_taxonomy:intel_signal_taxonomy(*)')
          .order('name'),
        supabase
          .from('intel_scale_matrix')
          .select('*, companies:intel_companies(name, ticker, sub_sector)')
          .order('sort_order'),
      ]);

      if (compErr) throw compErr;
      if (scaleErr) throw scaleErr;

      // Group companies by sub-sector
      const bySubSector = {};
      for (const company of companies) {
        const sector = company.sub_sector;
        if (!bySubSector[sector]) {
          bySubSector[sector] = [];
        }
        bySubSector[sector].push(company);
      }

      res.json({
        data: {
          companies,
          by_sub_sector: bySubSector,
          scale_matrix: scaleMatrix,
        },
      });
    } catch (error) {
      console.error('dashboard.subSectorDeepDive error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * GET /dashboard/advisory-pipeline
   * Opportunities with sub-opportunities + company signal cross-refs
   */
  async advisoryPipeline(req, res) {
    try {
      const [
        { data: opportunities, error: oppErr },
        { data: signals, error: sigErr },
      ] = await Promise.all([
        supabase
          .from('intel_opportunities')
          .select('*, sub_opportunities:intel_sub_opportunities(*), companies:intel_companies(name, ticker, am_signal, signal_taxonomy:intel_signal_taxonomy(*))')
          .order('stage')
          .order('account'),
        supabase
          .from('intel_signals')
          .select('id, company_id, indicator, signal, status, severity, confidence')
          .in('severity', ['Critical', 'High'])
          .order('severity'),
      ]);

      if (oppErr) throw oppErr;
      if (sigErr) throw sigErr;

      // Build signal cross-ref map by company_id
      const signalsByCompany = {};
      for (const sig of signals) {
        if (!signalsByCompany[sig.company_id]) {
          signalsByCompany[sig.company_id] = [];
        }
        signalsByCompany[sig.company_id].push(sig);
      }

      // Attach signal cross-refs to each opportunity
      const enriched = opportunities.map((opp) => ({
        ...opp,
        signal_cross_refs: opp.company_id
          ? signalsByCompany[opp.company_id] || []
          : [],
      }));

      res.json({
        data: {
          opportunities: enriched,
          stats: {
            total: opportunities.length,
            by_stage: opportunities.reduce((acc, o) => {
              acc[o.stage] = (acc[o.stage] || 0) + 1;
              return acc;
            }, {}),
            total_sub_opportunities: opportunities.reduce(
              (acc, o) => acc + (o.sub_opportunities?.length || 0),
              0
            ),
          },
        },
      });
    } catch (error) {
      console.error('dashboard.advisoryPipeline error:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
};

export default dashboardController;
