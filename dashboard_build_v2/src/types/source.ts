/**
 * SRCA-01: Source Attribution Types
 *
 * 4-tier source attribution system for data provenance tracking.
 * Every data point in the dashboard traces back to an original source.
 */

/** Source tier classification (T1 = highest confidence, T4 = lowest) */
export type SourceTier = 1 | 2 | 3 | 4;

/** Source confidence level based on data verification status */
export type SourceConfidence = "verified" | "derived" | "estimated";

/** Source attribution metadata attached to every data element */
export interface SourceInfo {
  /** Human-readable source name (e.g., "Screener.in Q3 FY2026 filing") */
  source: string;
  /** Confidence level of this data point */
  confidence: SourceConfidence;
  /** Source tier (1-4) per the attribution framework */
  tier: SourceTier;
  /** ISO-8601 date string of when the source data was last updated */
  lastUpdated: string;
  /** Optional URL to the original source for drill-through */
  url?: string;
}
