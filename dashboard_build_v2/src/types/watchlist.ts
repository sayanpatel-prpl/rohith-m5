/**
 * Watchlist section type definitions.
 *
 * Extends SectionData with 4-quadrant watchlist entries and a stress model.
 * Each entry carries severity scoring, source attribution, and service line tags.
 * Used by the Watchlist section (WTCH-01 through WTCH-04).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";
import type { AMServiceLine } from "./am-theme";

// ---------------------------------------------------------------------------
// Watchlist Quadrant
// ---------------------------------------------------------------------------

/** The four watchlist quadrant categories */
export type WatchlistQuadrant =
  | "likelyFundraises"
  | "marginInflection"
  | "consolidationTargets"
  | "stressIndicators";

// ---------------------------------------------------------------------------
// Watchlist Entry
// ---------------------------------------------------------------------------

/** A single watchlist entry within a quadrant */
export interface WatchlistEntry {
  /** Canonical company ID */
  companyId: string;
  /** Display name */
  companyName: string;
  /** Short signal label describing the trigger */
  signal: string;
  /** Detailed explanation of the watchlist signal */
  detail: string;
  /** Severity: 1 (low) to 5 (critical) */
  severity: 1 | 2 | 3 | 4 | 5;
  /** Estimated days until the event materializes, or null if unknown */
  daysToEvent: number | null;
  /** Source attribution for this signal */
  source: SourceInfo;
  /** Relevant A&M service line for engagement */
  serviceLine: AMServiceLine;
}

// ---------------------------------------------------------------------------
// Stress Model (WTCH-03)
// ---------------------------------------------------------------------------

/** Thresholds used to identify companies under financial stress */
export interface StressThresholds {
  /** Consecutive quarters of negative operating cash flow to flag */
  cashBurnQuarters: number;
  /** Months until debt maturity to flag (based on borrowing growth) */
  debtMaturityMonths: number;
  /** Consecutive quarters of revenue decline to flag */
  revenueDeclineQuarters: number;
  /** 25th percentile EBITDA margin -- companies below this are flagged */
  ebitdaMarginP25: number;
}

/** Stress model configuration and computed thresholds */
export interface StressModel {
  /** Thresholds used for stress detection */
  thresholds: StressThresholds;
}

// ---------------------------------------------------------------------------
// Watchlist Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Watchlist section */
export interface WatchlistData extends SectionData {
  /** Entries grouped by watchlist quadrant */
  quadrants: Record<WatchlistQuadrant, WatchlistEntry[]>;
  /** Stress model with computed thresholds */
  stressModel: StressModel;
}
