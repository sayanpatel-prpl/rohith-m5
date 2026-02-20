import type { SourceInfo, SourceTier, SourceConfidence } from "../types/source";

// ---------------------------------------------------------------------------
// Known Sources Registry (SRCA-04)
// Maps data source name patterns to their default SourceInfo metadata.
// NEVER returns a filename as source -- always the human-readable source name.
// ---------------------------------------------------------------------------

interface KnownSource {
  displayName: string;
  tier: SourceTier;
  confidence: SourceConfidence;
}

/**
 * Registry of known data sources with their tier and confidence defaults.
 * Keys are lowercase patterns matched against data source identifiers.
 */
const KNOWN_SOURCES: Record<string, KnownSource> = {
  // Tier 1: Official filings and verified financial data platforms
  screener: {
    displayName: "Screener.in",
    tier: 1,
    confidence: "verified",
  },
  trendlyne: {
    displayName: "Trendlyne",
    tier: 1,
    confidence: "verified",
  },
  bse: {
    displayName: "BSE India",
    tier: 1,
    confidence: "verified",
  },
  nse: {
    displayName: "NSE India",
    tier: 1,
    confidence: "verified",
  },
  "annual report": {
    displayName: "Company Annual Report",
    tier: 1,
    confidence: "verified",
  },
  "investor presentation": {
    displayName: "Investor Presentation",
    tier: 1,
    confidence: "verified",
  },

  // Tier 2: Reputable business media and analyst reports
  "economic times": {
    displayName: "Economic Times",
    tier: 2,
    confidence: "verified",
  },
  "business standard": {
    displayName: "Business Standard",
    tier: 2,
    confidence: "verified",
  },
  livemint: {
    displayName: "Livemint",
    tier: 2,
    confidence: "verified",
  },
  moneycontrol: {
    displayName: "Moneycontrol",
    tier: 2,
    confidence: "verified",
  },
  reuters: {
    displayName: "Reuters",
    tier: 2,
    confidence: "verified",
  },
  bloomberg: {
    displayName: "Bloomberg",
    tier: 2,
    confidence: "verified",
  },

  // Tier 3: Secondary analysis and intelligence platforms
  sovrenn: {
    displayName: "Sovrenn Intelligence",
    tier: 3,
    confidence: "derived",
  },
  "value research": {
    displayName: "Value Research",
    tier: 3,
    confidence: "derived",
  },
  tickertape: {
    displayName: "Tickertape",
    tier: 3,
    confidence: "derived",
  },

  // Tier 4: Unverified / social / aggregated
  "social media": {
    displayName: "Social Media",
    tier: 4,
    confidence: "estimated",
  },
  reddit: {
    displayName: "Reddit",
    tier: 4,
    confidence: "estimated",
  },
  twitter: {
    displayName: "Twitter/X",
    tier: 4,
    confidence: "estimated",
  },
};

/**
 * Look up a source in the KNOWN_SOURCES registry and return SourceInfo.
 * Matches against known source patterns (case-insensitive).
 * Falls back to tier 3 / derived if source is not recognized.
 *
 * NEVER returns a filename as source -- always the human-readable source name.
 *
 * @param dataSource - Source identifier from the data file (e.g., "screener", "Trendlyne", "sovrenn-intelligence.json")
 * @param lastUpdated - ISO date string of when the data was last updated
 * @returns SourceInfo with human-readable source name, tier, and confidence
 *
 * @example getSourceForDataPoint("screener", "2026-02-18")
 *   => { source: "Screener.in", confidence: "verified", tier: 1, lastUpdated: "2026-02-18" }
 */
export function getSourceForDataPoint(
  dataSource: string,
  lastUpdated: string,
): SourceInfo {
  const normalized = dataSource.toLowerCase();

  // Find matching known source by checking if the input contains any known key
  for (const [pattern, known] of Object.entries(KNOWN_SOURCES)) {
    if (normalized.includes(pattern)) {
      return {
        source: known.displayName,
        confidence: known.confidence,
        tier: known.tier,
        lastUpdated,
      };
    }
  }

  // Strip file extensions and path components for a cleaner display name
  let cleanName = dataSource
    .replace(/\.(json|csv|md|txt)$/i, "")
    .replace(/^.*[\\/]/, "")
    .replace(/[-_]/g, " ")
    .trim();

  // Title-case the cleaned name
  cleanName = cleanName
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return {
    source: cleanName || "Unknown Source",
    confidence: "derived",
    tier: 3,
    lastUpdated,
  };
}

/**
 * Check if a source is high confidence (tier 1-2 with verified confidence).
 * Used to determine whether to display data prominently or with caveats.
 *
 * @example isHighConfidence({ tier: 1, confidence: "verified", ... }) => true
 * @example isHighConfidence({ tier: 3, confidence: "derived", ... }) => false
 */
export function isHighConfidence(source: SourceInfo): boolean {
  return source.tier <= 2 && source.confidence === "verified";
}

/**
 * Format an ISO date string to a human-readable display format.
 *
 * @example formatSourceDate("2026-02-18") => "Feb 18, 2026"
 * @example formatSourceDate("2025-12-01") => "Dec 1, 2025"
 */
export function formatSourceDate(isoDate: string): string {
  const date = new Date(isoDate + "T00:00:00");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// Re-export KNOWN_SOURCES for testing and adapter use
export { KNOWN_SOURCES };
