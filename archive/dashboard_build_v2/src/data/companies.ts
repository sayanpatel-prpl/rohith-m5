/**
 * Master company registry for all 16 tracked companies.
 *
 * Provides lookup by ID, ticker, or display name. All data adapters
 * and section components use this registry for company metadata.
 *
 * Data sourced from consolidated-dashboard-data.json, trendlyne-summary.json,
 * and sovrenn-intelligence.json. daikin and jch are included even though
 * they may not appear in all data files.
 */

import type { Company } from "../types/company";

/** Complete registry of all 16 companies */
export const COMPANIES: Company[] = [
  {
    id: "amber",
    name: "Amber Enterprises India",
    ticker: "AMBER",
    nseSymbol: "AMBER",
    subSector: "EMS",
  },
  {
    id: "bajaj",
    name: "Bajaj Electricals",
    ticker: "BAJAJELEC",
    nseSymbol: "BAJAJELEC",
    subSector: "Electrical",
  },
  {
    id: "bluestar",
    name: "Blue Star Limited",
    ticker: "BLUESTARCO",
    nseSymbol: "BLUESTARCO",
    subSector: "AC",
  },
  {
    id: "butterfly",
    name: "Butterfly Gandhimathi Appliances",
    ticker: "BUTTERFLY",
    nseSymbol: "BUTTERFLY",
    subSector: "Kitchen",
  },
  {
    id: "crompton",
    name: "Crompton Greaves Consumer Electricals",
    ticker: "CROMPTON",
    nseSymbol: "CROMPTON",
    subSector: "Electrical",
  },
  {
    id: "daikin",
    name: "Daikin India",
    ticker: "DAIKIN",
    subSector: "AC",
  },
  {
    id: "dixon",
    name: "Dixon Technologies (India)",
    ticker: "DIXON",
    nseSymbol: "DIXON",
    subSector: "EMS",
  },
  {
    id: "havells",
    name: "Havells India Limited",
    ticker: "HAVELLS",
    nseSymbol: "HAVELLS",
    subSector: "Electrical",
  },
  {
    id: "ifb",
    name: "IFB Industries Limited",
    ticker: "IFBIND",
    nseSymbol: "IFBIND",
    subSector: "Kitchen",
  },
  {
    id: "jch",
    name: "Johnson Controls-Hitachi Air Conditioning India",
    ticker: "JCHAC",
    nseSymbol: "JCHAC",
    subSector: "AC",
  },
  {
    id: "orient",
    name: "Orient Electric Limited",
    ticker: "ORIENTELEC",
    nseSymbol: "ORIENTELEC",
    subSector: "Electrical",
  },
  {
    id: "symphony",
    name: "Symphony Limited",
    ticker: "SYMPHONY",
    nseSymbol: "SYMPHONY",
    subSector: "Cooler",
  },
  {
    id: "ttk",
    name: "TTK Prestige Limited",
    ticker: "TTKPRESTIG",
    nseSymbol: "TTKPRESTIG",
    subSector: "Kitchen",
  },
  {
    id: "vguard",
    name: "V-Guard Industries Limited",
    ticker: "VGUARD",
    nseSymbol: "VGUARD",
    subSector: "Mixed",
  },
  {
    id: "voltas",
    name: "Voltas Limited",
    ticker: "VOLTAS",
    nseSymbol: "VOLTAS",
    subSector: "AC",
  },
  {
    id: "whirlpool",
    name: "Whirlpool of India Limited",
    ticker: "WHIRLPOOL",
    nseSymbol: "WHIRLPOOL",
    subSector: "Kitchen",
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/** Find a company by its canonical ID */
export function getCompanyById(id: string): Company | undefined {
  return COMPANIES.find((c) => c.id === id.toLowerCase());
}

/** Find a company by its ticker symbol (case-insensitive) */
export function getCompanyByTicker(ticker: string): Company | undefined {
  const t = ticker.toUpperCase();
  return COMPANIES.find(
    (c) => c.ticker === t || c.nseSymbol === t,
  );
}

/** Find a company by its display name (case-insensitive partial match) */
export function getCompanyByName(name: string): Company | undefined {
  const lower = name.toLowerCase();
  return COMPANIES.find(
    (c) =>
      c.name.toLowerCase() === lower ||
      c.name.toLowerCase().includes(lower) ||
      lower.includes(c.name.split(" ")[0].toLowerCase()),
  );
}
