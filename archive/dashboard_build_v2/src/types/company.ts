/**
 * Company type definitions and canonical company registry.
 *
 * The 16 companies tracked in the Consumer Durables intelligence dashboard.
 * All data adapters normalize to these canonical IDs.
 */

/** Company interface with identification and classification fields */
export interface Company {
  /** Canonical company ID (lowercase, used as key across all data files) */
  id: string;
  /** Full display name (e.g., "Voltas Limited") */
  name: string;
  /** BSE/NSE ticker symbol */
  ticker: string;
  /** NSE symbol if different from ticker */
  nseSymbol?: string;
  /** Sub-sector classification */
  subSector: "AC" | "Kitchen" | "Electrical" | "EMS" | "Mixed" | "Cooler";
}

/**
 * Canonical list of 16 company IDs tracked in the dashboard.
 * All data adapters must normalize to these IDs.
 */
export const COMPANY_IDS = [
  "amber",
  "bajaj",
  "bluestar",
  "butterfly",
  "crompton",
  "daikin",
  "dixon",
  "havells",
  "ifb",
  "jch",
  "orient",
  "symphony",
  "ttk",
  "vguard",
  "voltas",
  "whirlpool",
] as const;

/** Type-safe company ID derived from the canonical list */
export type CompanyId = (typeof COMPANY_IDS)[number];

/**
 * Get a human-friendly display name for a company ID.
 * Falls back to title-casing the ID if not in the registry.
 */
export function getCompanyDisplayName(companyId: string): string {
  const displayNames: Record<string, string> = {
    amber: "Amber Enterprises",
    bajaj: "Bajaj Electricals",
    bluestar: "Blue Star",
    butterfly: "Butterfly Gandhimathi",
    crompton: "Crompton Greaves CE",
    daikin: "Daikin India",
    dixon: "Dixon Technologies",
    havells: "Havells India",
    ifb: "IFB Industries",
    jch: "Johnson Controls-Hitachi",
    orient: "Orient Electric",
    symphony: "Symphony",
    ttk: "TTK Prestige",
    vguard: "V-Guard Industries",
    voltas: "Voltas",
    whirlpool: "Whirlpool India",
  };

  return displayNames[companyId] ?? companyId.charAt(0).toUpperCase() + companyId.slice(1);
}
