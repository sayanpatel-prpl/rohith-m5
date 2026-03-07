-- ============================================================
-- II Signal Architecture Extensions — 3 New Tables
-- Extends existing 22-table schema with:
--   intel_financial_signals  (change signals from financial data)
--   intel_analyst_interactions (earnings call Q&A analysis)
--   intel_sector_signals (unified cross-company signal index)
-- ============================================================

-- ======================== NEW ENUMS ==========================

DO $$ BEGIN
  CREATE TYPE intel_dimension AS ENUM (
    'financial', 'transcript', 'operational', 'strategic', 'governance', 'sector'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_financial_signal_type AS ENUM (
    'revenue_trajectory', 'margin_dynamics', 'capital_efficiency',
    'balance_sheet_event', 'working_capital_stress', 'valuation_anomaly',
    'guidance_credibility'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_margin_type AS ENUM (
    'gross', 'ebitda', 'ebit', 'pat', 'contribution'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE intel_tone_shift AS ENUM (
    'confident_to_cautious', 'cautious_to_confident',
    'specific_to_vague', 'vague_to_specific',
    'proactive_to_defensive', 'defensive_to_proactive',
    'bullish_to_neutral', 'neutral_to_bullish',
    'neutral_to_bearish', 'bearish_to_neutral'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ======================== FINANCIAL SIGNALS ==================

CREATE TABLE IF NOT EXISTS intel_financial_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  signal_type intel_financial_signal_type NOT NULL,
  severity intel_severity NOT NULL DEFAULT 'Medium',

  -- Revenue trajectory
  current_value NUMERIC,
  prior_value NUMERIC,
  change_pct NUMERIC,
  benchmark_value NUMERIC,      -- sector median for comparison

  -- Margin dynamics
  margin_type intel_margin_type,
  delta_bps INTEGER,            -- basis points change
  driver TEXT,                  -- what caused the margin movement

  -- Capital efficiency
  metric TEXT,                  -- ROCE | ROE | ROA
  trend_3yr TEXT,               -- improving | stable | declining
  sector_avg NUMERIC,
  rank INTEGER,                 -- rank among 16 companies

  -- Balance sheet
  rating_agency TEXT,
  rating TEXT,
  outlook TEXT,                 -- stable | positive | negative | watch

  -- Working capital
  wc_days NUMERIC,
  inventory_days NUMERIC,
  debtor_days NUMERIC,
  cash_conversion_cycle NUMERIC,
  cash_flow_from_ops NUMERIC,

  -- Valuation
  pe_ratio NUMERIC,
  sector_pe NUMERIC,
  premium_discount_pct NUMERIC,

  -- Guidance credibility
  guided_value NUMERIC,
  actual_value NUMERIC,
  variance_pct NUMERIC,
  quarters_missed INTEGER,

  -- Evidence
  evidence TEXT,
  source_document TEXT,
  period TEXT,                  -- Q3 FY26 | FY25 | etc

  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intel_fin_sig_company ON intel_financial_signals(company_id);
CREATE INDEX idx_intel_fin_sig_type ON intel_financial_signals(signal_type);
CREATE INDEX idx_intel_fin_sig_severity ON intel_financial_signals(severity);

-- ======================== ANALYST INTERACTIONS ================

CREATE TABLE IF NOT EXISTS intel_analyst_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id TEXT NOT NULL REFERENCES intel_companies(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL,    -- analyst_skepticism | management_tone_shift | non_disclosure | guidance_revision

  -- Analyst skepticism
  analyst_name TEXT,
  analyst_firm TEXT,
  question TEXT,
  response TEXT,
  credibility_score INTEGER CHECK (credibility_score BETWEEN 1 AND 5),

  -- Management tone shift
  topic TEXT,
  tone_before TEXT,
  tone_after TEXT,
  shift_type intel_tone_shift,

  -- Non-disclosure
  metric_name TEXT,
  last_disclosed_period TEXT,
  significance intel_severity,

  -- Guidance revision
  original_guidance TEXT,
  current_guidance TEXT,
  guidance_shift_type TEXT,     -- withdrawal | downward_revision | upward_revision | vague_restatement

  -- Evidence
  evidence TEXT,
  source_document TEXT,
  period TEXT,
  severity intel_severity NOT NULL DEFAULT 'Medium',

  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intel_analyst_company ON intel_analyst_interactions(company_id);
CREATE INDEX idx_intel_analyst_type ON intel_analyst_interactions(signal_type);
CREATE INDEX idx_intel_analyst_severity ON intel_analyst_interactions(severity);

-- ======================== SECTOR SIGNAL INDEX ================

CREATE TABLE IF NOT EXISTS intel_sector_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dimension intel_dimension NOT NULL,
  signal_type TEXT NOT NULL,
  severity intel_severity NOT NULL DEFAULT 'Medium',
  title TEXT NOT NULL,
  description TEXT,
  affected_companies TEXT[] NOT NULL DEFAULT '{}',  -- company_ids
  primary_company_id TEXT REFERENCES intel_companies(id) ON DELETE SET NULL,
  source_table TEXT NOT NULL,   -- intel_financial_signals | intel_signals | intel_deals | etc
  source_id UUID,               -- FK to source row
  period TEXT,                  -- Q3 FY26 | FY25 | etc
  pattern_type TEXT,            -- turnaround_candidate | transaction_advisory | performance_improvement | governance_risk | sector_theme
  service_lines TEXT[],         -- ['Turnaround', 'PEPI', 'CDD', 'Transaction Advisory']
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_intel_sector_sig_dimension ON intel_sector_signals(dimension);
CREATE INDEX idx_intel_sector_sig_type ON intel_sector_signals(signal_type);
CREATE INDEX idx_intel_sector_sig_severity ON intel_sector_signals(severity);
CREATE INDEX idx_intel_sector_sig_pattern ON intel_sector_signals(pattern_type);
CREATE INDEX idx_intel_sector_sig_primary ON intel_sector_signals(primary_company_id);
