-- Kompete - Industry Intel Database Schema
-- SQLite database for storing structured company intelligence

-- Companies (master list)
CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    ticker TEXT,
    sub_sector TEXT,
    description TEXT,
    clients TEXT, -- JSON array of client names
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quarterly financial results
CREATE TABLE IF NOT EXISTS quarterly_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    date TEXT NOT NULL, -- e.g., "29th Jul 2025"
    quarter TEXT NOT NULL, -- e.g., "Q1FY26", "Jun-25"
    sales_cr REAL,
    sales_growth_yoy REAL, -- percentage
    sales_growth_qoq REAL, -- percentage
    net_profit_cr REAL,
    profit_growth_yoy REAL, -- percentage
    profit_growth_qoq REAL, -- percentage
    ebitda_margin REAL, -- percentage
    tag TEXT, -- "EXCELLENT RESULTS", "GOOD RESULTS", etc.
    raw_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, quarter)
);

-- Deal activity (M&A, investments, partnerships)
CREATE TABLE IF NOT EXISTS deals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL, -- 'acquisition', 'investment', 'ipo', 'qip', 'partnership', 'other'
    description TEXT NOT NULL,
    value_cr REAL, -- in crores (nullable)
    parties TEXT, -- JSON array of parties involved
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Concall highlights
CREATE TABLE IF NOT EXISTS concall_highlights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    date TEXT NOT NULL,
    quarter TEXT NOT NULL, -- e.g., "Q1FY26"
    points TEXT NOT NULL, -- JSON array of highlight points
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id),
    UNIQUE(company_id, quarter)
);

-- Key growth triggers
CREATE TABLE IF NOT EXISTS growth_triggers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    trigger_text TEXT NOT NULL,
    category TEXT, -- e.g., "division", "expansion", "order_book"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Shareholding data
CREATE TABLE IF NOT EXISTS shareholding (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT NOT NULL,
    date TEXT NOT NULL,
    holder TEXT NOT NULL, -- institution/fund name
    stake REAL NOT NULL, -- percentage
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_quarterly_results_company ON quarterly_results(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_company ON deals(company_id);
CREATE INDEX IF NOT EXISTS idx_deals_date ON deals(date);
CREATE INDEX IF NOT EXISTS idx_concall_company ON concall_highlights(company_id);
CREATE INDEX IF NOT EXISTS idx_shareholding_company ON shareholding(company_id);
CREATE INDEX IF NOT EXISTS idx_growth_triggers_company ON growth_triggers(company_id);
