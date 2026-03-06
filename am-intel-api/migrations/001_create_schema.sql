-- ============================================================
-- A&M Industry Intel — Database Schema
-- Supabase (PostgreSQL) — 22 tables + ENUMs
-- All tables prefixed with intel_ to avoid conflicts with
-- existing Kompete SaaS tables in the same Supabase instance
-- ============================================================

-- ======================== ENUMS =============================
-- Prefix with intel_ to avoid conflicts

DO $$ BEGIN
  CREATE TYPE intel_sub_sector AS ENUM ('Cooling','Electrical','Kitchen','Appliances','EMS/OEM','Diversified','Water & Security');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_performance AS ENUM ('outperform','inline','underperform');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_signal_primary AS ENUM ('performance','transition','friction','ecosystem');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_urgency AS ENUM ('high','medium','watch');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_signal_status AS ENUM ('Positive','Negative','Watch');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_severity AS ENUM ('Critical','High','Medium','Low','Informational');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_confidence AS ENUM ('direct','calculated','inferred','verified');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_opp_stage AS ENUM ('Identified','Qualified','Qualify','Outreach');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_evidence_tier AS ENUM ('verified','derived','guidance','estimated');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_drift_shift AS ENUM ('retreat','pivot','silence','reframe','stall','contradiction','escalation');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_drift_severity AS ENUM ('critical','high','medium','low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_move_type AS ENUM ('M&A','Product','Capacity','Distribution','Partnership','PLI/Govt','Pricing','Digital','Leadership','Risk');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_move_impact AS ENUM ('High','Medium','Low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_absence_sig AS ENUM ('critical','high','medium','low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_tvw_badge AS ENUM ('disconnect','stealth','aligned');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_am_signal AS ENUM ('turnaround','transaction','engage','monitor','perf-improve');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ======================== CORE TABLES =======================

-- 1. Companies (root entity)
CREATE TABLE IF NOT EXISTS intel_companies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ticker TEXT NOT NULL UNIQUE,
  sub_sector intel_sub_sector NOT NULL,
  am_signal intel_am_signal NOT NULL,
  perf intel_performance NOT NULL,
  variance TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Signal Taxonomy (1:1 with companies)
CREATE TABLE IF NOT EXISTS intel_signal_taxonomy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  primary_type intel_signal_primary NOT NULL,
  signals TEXT[] NOT NULL DEFAULT '{}',
  service_lines TEXT[] NOT NULL DEFAULT '{}',
  urgency intel_urgency NOT NULL,
  thesis_situation TEXT,
  thesis_complication TEXT,
  thesis_implication TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

CREATE INDEX IF NOT EXISTS idx_intel_tax_company ON intel_signal_taxonomy(company_id);
CREATE INDEX IF NOT EXISTS idx_intel_tax_urgency ON intel_signal_taxonomy(urgency);

-- 3. Financial Periods
CREATE TABLE IF NOT EXISTS intel_financial_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  fiscal_year TEXT NOT NULL,
  quarter TEXT,
  revenue NUMERIC,
  ebitda_pct NUMERIC,
  pat NUMERIC,
  rev_growth NUMERIC,
  roce NUMERIC,
  de NUMERIC,
  pe NUMERIC,
  wc_days NUMERIC,
  inv_days NUMERIC,
  debtor_days NUMERIC,
  ccc NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, fiscal_year, quarter)
);

CREATE INDEX IF NOT EXISTS idx_intel_fin_company ON intel_financial_periods(company_id);

-- 4. Product Mix (1:N)
CREATE TABLE IF NOT EXISTS intel_product_mix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  segment TEXT NOT NULL,
  percentage NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_pmix_company ON intel_product_mix(company_id);

-- 5. Premium Mix (1:1)
CREATE TABLE IF NOT EXISTS intel_premium_mix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  premium NUMERIC NOT NULL,
  mass NUMERIC NOT NULL,
  economy NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- ======================== SIGNAL TABLES =====================

-- 6. Signals (1:N with companies)
CREATE TABLE IF NOT EXISTS intel_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  rank INTEGER NOT NULL,
  indicator TEXT NOT NULL,
  signal TEXT NOT NULL,
  status intel_signal_status NOT NULL,
  time_period TEXT NOT NULL,
  severity intel_severity NOT NULL,
  rationale TEXT NOT NULL,
  confidence intel_confidence NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_sig_company ON intel_signals(company_id);
CREATE INDEX IF NOT EXISTS idx_intel_sig_severity ON intel_signals(severity);
CREATE INDEX IF NOT EXISTS idx_intel_sig_company_rank ON intel_signals(company_id, rank);

-- 7. Signal Evidence (1:N with signals)
CREATE TABLE IF NOT EXISTS intel_signal_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID NOT NULL REFERENCES intel_signals(id) ON DELETE CASCADE,
  quote TEXT NOT NULL,
  source_document TEXT NOT NULL,
  reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_ev_signal ON intel_signal_evidence(signal_id);

-- ======================== INTELLIGENCE TABLES ===============

-- 8. Narrative Drifts
CREATE TABLE IF NOT EXISTS intel_narrative_drifts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  narrative_before TEXT NOT NULL,
  narrative_after TEXT NOT NULL,
  shift_type intel_drift_shift NOT NULL,
  severity intel_drift_severity NOT NULL,
  evidence TEXT NOT NULL,
  implication TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_drift_company ON intel_narrative_drifts(company_id);

-- 9. Absence Signals
CREATE TABLE IF NOT EXISTS intel_absence_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  category TEXT NOT NULL,
  significance intel_absence_sig NOT NULL,
  context TEXT NOT NULL,
  implication TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_absence_company ON intel_absence_signals(company_id);

-- 10. Competitive Moves
CREATE TABLE IF NOT EXISTS intel_competitive_moves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  move_type intel_move_type NOT NULL,
  description TEXT NOT NULL,
  impact intel_move_impact NOT NULL,
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  move_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_moves_company ON intel_competitive_moves(company_id);

-- 11. Themes
CREATE TABLE IF NOT EXISTS intel_themes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  theme_type TEXT NOT NULL DEFAULT 'big_theme',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Theme Evidence (M:N bridge)
CREATE TABLE IF NOT EXISTS intel_theme_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id TEXT NOT NULL REFERENCES intel_themes(id) ON DELETE CASCADE,
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  metric TEXT NOT NULL,
  evidence TEXT NOT NULL,
  source TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(theme_id, company_id)
);

CREATE INDEX IF NOT EXISTS idx_intel_thev_theme ON intel_theme_evidence(theme_id);
CREATE INDEX IF NOT EXISTS idx_intel_thev_company ON intel_theme_evidence(company_id);

-- ======================== SECTION-SPECIFIC TABLES ===========

-- 13. Opportunities
CREATE TABLE IF NOT EXISTS intel_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account TEXT NOT NULL,
  company_id TEXT REFERENCES intel_companies(id) ON DELETE SET NULL,
  stage intel_opp_stage NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_opp_stage ON intel_opportunities(stage);

-- 14. Sub-Opportunities
CREATE TABLE IF NOT EXISTS intel_sub_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES intel_opportunities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  service_line TEXT NOT NULL,
  signals TEXT NOT NULL,
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_sub_opp ON intel_sub_opportunities(opportunity_id);

-- 15. Talk vs Walk (1:1)
CREATE TABLE IF NOT EXISTS intel_talk_vs_walk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  badge intel_tvw_badge NOT NULL,
  management_says TEXT NOT NULL,
  data_shows TEXT NOT NULL,
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  narrative_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- 16. Market Pulse Signals
CREATE TABLE IF NOT EXISTS intel_market_pulse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  direction TEXT NOT NULL,
  badge_label TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  headline_value TEXT NOT NULL,
  cost_change TEXT,
  detail TEXT NOT NULL,
  affected_companies TEXT[],
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Watchlist (1:1)
CREATE TABLE IF NOT EXISTS intel_watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  signal_text TEXT NOT NULL,
  detail TEXT NOT NULL,
  severity_score INTEGER NOT NULL DEFAULT 3,
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  catalysts JSONB,
  forward_signals JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- 18. Deals & Transactions
CREATE TABLE IF NOT EXISTS intel_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT REFERENCES intel_companies(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  deal_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  value_cr NUMERIC,
  status TEXT,
  deal_date DATE,
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Leadership & Governance
CREATE TABLE IF NOT EXISTS intel_leadership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  risk_score INTEGER,
  event_date DATE,
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Action Lens Items
CREATE TABLE IF NOT EXISTS intel_action_lens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona TEXT NOT NULL,
  company_id TEXT REFERENCES intel_companies(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  action_items JSONB,
  source TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_action_persona ON intel_action_lens(persona);

-- 21. Scale Matrix (1:1)
CREATE TABLE IF NOT EXISTS intel_scale_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  revenue_cr NUMERIC,
  ebitda_pct NUMERIC,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- 22. Operational Intelligence
CREATE TABLE IF NOT EXISTS intel_ops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value TEXT NOT NULL,
  trend TEXT,
  confidence intel_confidence NOT NULL DEFAULT 'calculated',
  cross_links TEXT[],
  source TEXT NOT NULL,
  tier intel_evidence_tier NOT NULL DEFAULT 'verified',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_intel_ops_company ON intel_ops(company_id);

-- ======================== UPDATED_AT TRIGGER ================

CREATE OR REPLACE FUNCTION intel_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all intel_ tables with updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT table_name FROM information_schema.columns
    WHERE column_name = 'updated_at'
    AND table_schema = 'public'
    AND table_name LIKE 'intel_%'
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I',
      t, t
    );
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION intel_update_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;
