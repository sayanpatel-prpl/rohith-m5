/** Time range comparison periods */
export type TimeRange = "QoQ" | "YoY" | "MoM";

/** Data freshness metadata attached to each section */
export interface DataRecency {
  /** Human-readable period, e.g. "Q3 FY25" */
  dataAsOf: string;
  /** ISO-8601 date string of last data refresh */
  lastUpdated: string;
}

/** AI confidence level for signals and flags */
export type ConfidenceLevel = "high" | "medium" | "low";

/** Performance relative to peers */
export type PerformanceLevel = "outperform" | "inline" | "underperform";

/** Directional trend indicator */
export type TrendDirection = "up" | "down" | "flat";

/** Inline chart annotation rendered as ReferenceDot */
export interface ChartAnnotation {
  /** Unique key for React list rendering */
  key: string;
  /** X-axis value (category string or numeric index) */
  x: string | number;
  /** Y-axis value */
  y: number;
  /** Label text displayed above the dot */
  label: string;
}

/** Literal union of all 10 section route paths */
export type SectionId =
  | "executive"
  | "market-pulse"
  | "financial"
  | "deals"
  | "operations"
  | "leadership"
  | "competitive"
  | "deep-dive"
  | "action-lens"
  | "watchlist";
