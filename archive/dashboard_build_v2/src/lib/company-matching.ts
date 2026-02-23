import { COMPANY_IDS, type CompanyId } from "../types/company";

/**
 * Fuzzy company match: returns true if `field` contains
 * either the first word of `companyName` or the `companyId` (case-insensitive).
 *
 * Used for data sources that store display names (leadership, watchlist, deals).
 */
export function matchesCompany(
  field: string,
  companyName: string,
  companyId: string,
): boolean {
  const lower = field.toLowerCase();
  return (
    lower.includes(companyName.split(" ")[0].toLowerCase()) ||
    lower.includes(companyId.toLowerCase())
  );
}

/**
 * Exact company match on lowercase ID.
 *
 * Used for data sources that store lowercase IDs (operations, financial).
 */
export function matchesCompanyId(field: string, companyId: string): boolean {
  return field.toLowerCase() === companyId.toLowerCase();
}

/**
 * Filter an array by fuzzy company match on an extracted field.
 */
export function filterByCompany<T>(
  items: T[],
  accessor: (item: T) => string,
  companyName: string,
  companyId: string,
): T[] {
  return items.filter((item) =>
    matchesCompany(accessor(item), companyName, companyId),
  );
}

/**
 * Filter an array by exact company ID match on an extracted field.
 */
export function filterByCompanyId<T>(
  items: T[],
  accessor: (item: T) => string,
  companyId: string,
): T[] {
  return items.filter((item) =>
    matchesCompanyId(accessor(item), companyId),
  );
}

// ---------------------------------------------------------------------------
// Company ID Normalization (DATA-04, Pitfall 4)
// ---------------------------------------------------------------------------

/**
 * Map of variant company names/IDs from different JSON sources
 * to their canonical IDs in the COMPANY_IDS list.
 *
 * Different data files use different identifiers:
 * - consolidated-dashboard-data.json: "voltas", "amber" (lowercase)
 * - screener-all-companies.json: keyed by "voltas", "amber" etc.
 * - sovrenn-intelligence.json: "companyId: amber" (lowercase)
 * - trendlyne-summary.json: "companyId: voltas" (lowercase)
 * - Variant display names: "Voltas Ltd", "AMBER", "Blue Star Ltd"
 */
const VARIANT_MAP: Record<string, CompanyId> = {
  // Amber Enterprises variants
  amber: "amber",
  "amber enterprises": "amber",
  "amber enterprises india": "amber",
  "amber enterprises india limited": "amber",
  "amber enterprises india ltd": "amber",

  // Bajaj Electricals variants
  bajaj: "bajaj",
  "bajaj electricals": "bajaj",
  "bajaj electricals limited": "bajaj",
  "bajaj electricals ltd": "bajaj",
  bajajelec: "bajaj",

  // Blue Star variants
  bluestar: "bluestar",
  "blue star": "bluestar",
  "blue star limited": "bluestar",
  "blue star ltd": "bluestar",
  bluestarco: "bluestar",

  // Butterfly Gandhimathi variants
  butterfly: "butterfly",
  "butterfly gandhimathi": "butterfly",
  "butterfly gandhimathi appliances": "butterfly",
  "butterfly gandhimathi appliances ltd": "butterfly",

  // Crompton variants
  crompton: "crompton",
  "crompton greaves": "crompton",
  "crompton greaves consumer": "crompton",
  "crompton greaves consumer electricals": "crompton",
  "crompton greaves consumer electricals limited": "crompton",
  "crompton greaves ce": "crompton",

  // Daikin variants
  daikin: "daikin",
  "daikin india": "daikin",
  "daikin airconditioning india": "daikin",

  // Dixon Technologies variants
  dixon: "dixon",
  "dixon technologies": "dixon",
  "dixon technologies india": "dixon",
  "dixon technologies (india) limited": "dixon",
  "dixon technologies india ltd": "dixon",

  // Havells variants
  havells: "havells",
  "havells india": "havells",
  "havells india limited": "havells",
  "havells india ltd": "havells",

  // IFB Industries variants
  ifb: "ifb",
  "ifb industries": "ifb",
  "ifb industries limited": "ifb",
  "ifb industries ltd": "ifb",
  ifbind: "ifb",

  // Johnson Controls-Hitachi variants
  jch: "jch",
  "johnson controls-hitachi": "jch",
  "johnson controls hitachi": "jch",
  "johnson controls-hitachi air conditioning india": "jch",

  // Orient Electric variants
  orient: "orient",
  "orient electric": "orient",
  "orient electric limited": "orient",
  "orient electric ltd": "orient",
  orientelec: "orient",

  // Symphony variants
  symphony: "symphony",
  "symphony limited": "symphony",
  "symphony ltd": "symphony",

  // TTK Prestige variants
  ttk: "ttk",
  "ttk prestige": "ttk",
  "ttk prestige limited": "ttk",
  "ttk prestige ltd": "ttk",
  ttkprestig: "ttk",

  // V-Guard variants
  vguard: "vguard",
  "v-guard": "vguard",
  "v-guard industries": "vguard",
  "v-guard industries limited": "vguard",
  "v-guard industries ltd": "vguard",
  "vguard industries": "vguard",

  // Voltas variants
  voltas: "voltas",
  "voltas limited": "voltas",
  "voltas ltd": "voltas",

  // Whirlpool variants
  whirlpool: "whirlpool",
  "whirlpool of india": "whirlpool",
  "whirlpool of india limited": "whirlpool",
  "whirlpool of india ltd": "whirlpool",
  "whirlpool india": "whirlpool",
};

/**
 * Normalize a raw company ID or name from any data source to a canonical CompanyId.
 *
 * Handles the varied identifiers used across JSON files:
 * - "Voltas Ltd" -> "voltas"
 * - "AMBER" -> "amber"
 * - "Blue Star Limited" -> "bluestar"
 * - "bajajelec" (ticker) -> "bajaj"
 *
 * Returns null if the input cannot be mapped to a known company.
 *
 * @example normalizeCompanyId("Voltas Ltd") => "voltas"
 * @example normalizeCompanyId("AMBER") => "amber"
 * @example normalizeCompanyId("Unknown Corp") => null
 */
export function normalizeCompanyId(rawId: string): CompanyId | null {
  const normalized = rawId.trim().toLowerCase();

  // Direct match in variant map
  const mapped = VARIANT_MAP[normalized];
  if (mapped) return mapped;

  // Check if it directly matches a canonical ID
  if ((COMPANY_IDS as readonly string[]).includes(normalized)) {
    return normalized as CompanyId;
  }

  // Try matching first word against canonical IDs
  const firstWord = normalized.split(/[\s,.-]+/)[0];
  if (firstWord && (COMPANY_IDS as readonly string[]).includes(firstWord)) {
    return firstWord as CompanyId;
  }

  return null;
}
