/**
 * Executive section type definitions.
 *
 * Extends SectionData with intelligence grade, A&M opportunity summary,
 * big themes, red flags, narrative risks, and company snapshots.
 * Used by the Executive Dashboard section (EXEC-01 through EXEC-05).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";
import type { AMServiceLine } from "./am-theme";
import type { PerformanceLevel } from "./common";

// ---------------------------------------------------------------------------
// Intelligence Grade (EXEC-01)
// ---------------------------------------------------------------------------

/** Letter grade for data quality/coverage */
export type IntelligenceGradeLevel =
  | "A"
  | "A-"
  | "B+"
  | "B"
  | "B-"
  | "C+"
  | "C";

/** Overall intelligence quality assessment */
export interface IntelligenceGrade {
  /** Letter grade based on data coverage across sources */
  grade: IntelligenceGradeLevel;
  /** Human-readable explanation of how the grade was computed */
  methodology: string;
  /** Key factors that influenced the grade */
  factors: string[];
}

// ---------------------------------------------------------------------------
// A&M Opportunity Summary (EXEC-02)
// ---------------------------------------------------------------------------

/** Breakdown of advisory opportunities by service line */
export interface ServiceLineBreakdownEntry {
  serviceLine: AMServiceLine;
  count: number;
}

/** High-level summary of advisory opportunity landscape */
export interface AMOpportunitySummary {
  /** Estimated total advisory opportunity in INR Crore (2% of distressed market cap), or null if not computable */
  totalAdvisoryOpportunityCr: number | null;
  /** Number of companies showing distress signals */
  companiesInDistress: number;
  /** Most recommended A&M action based on distress patterns */
  topRecommendedAction: string;
  /** Count of opportunities per service line */
  serviceLineBreakdown: ServiceLineBreakdownEntry[];
}

// ---------------------------------------------------------------------------
// Big Themes (EXEC-03)
// ---------------------------------------------------------------------------

/** A cross-company strategic theme extracted from intelligence sources */
export interface BigTheme {
  /** Short theme label */
  theme: string;
  /** Detailed explanation of the theme */
  detail: string;
  /** Source attribution for the theme data */
  source: SourceInfo;
  /** Company IDs affected by this theme */
  companiesAffected: string[];
}

// ---------------------------------------------------------------------------
// Red Flags (EXEC-04)
// ---------------------------------------------------------------------------

/** A company-level risk flag with severity and service line classification */
export interface RedFlag {
  /** Short flag label (e.g., "Revenue Decline") */
  flag: string;
  /** Detailed description of the issue */
  detail: string;
  /** Severity level: 1 (minor) to 5 (critical) */
  severity: 1 | 2 | 3 | 4 | 5;
  /** Source attribution */
  source: SourceInfo;
  /** Relevant A&M service line for engagement */
  serviceLine: AMServiceLine;
  /** Canonical company ID */
  companyId: string;
}

// ---------------------------------------------------------------------------
// Narrative Risks / Talk vs Walk (EXEC-05)
// ---------------------------------------------------------------------------

/** Disconnect between company narrative and actual performance */
export interface NarrativeRisk {
  /** Company display name */
  company: string;
  /** What the company/market narrative claims */
  claim: string;
  /** What the actual financial data shows */
  reality: string;
  /** Red = narrative overpromises vs reality; Green = stealth improvement not reflected in narrative */
  disconnect: "red" | "green";
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Company Snapshot
// ---------------------------------------------------------------------------

/** Per-company summary for the executive section */
export interface ExecutiveCompanySnapshot {
  /** Canonical company ID */
  id: string;
  /** Display name */
  name: string;
  /** Performance tier relative to peers */
  performance: PerformanceLevel;
  /** Latest revenue growth percentage (YoY) */
  revenueGrowth: number | null;
  /** Latest EBITDA margin percentage */
  ebitdaMargin: number | null;
  /** Latest quarter label (e.g., "Q3 FY2026") */
  latestQuarter: string | null;
}

// ---------------------------------------------------------------------------
// Executive Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Executive section */
export interface ExecutiveData extends SectionData {
  /** Overall data quality/coverage grade */
  intelligenceGrade: IntelligenceGrade;
  /** A&M advisory opportunity landscape */
  opportunitySummary: AMOpportunitySummary;
  /** Cross-company strategic themes (EXEC-03) */
  bigThemes: BigTheme[];
  /** Company-level risk flags (EXEC-04) */
  redFlags: RedFlag[];
  /** Narrative vs reality disconnects (EXEC-05) */
  narrativeRisks: NarrativeRisk[];
  /** Per-company executive snapshots */
  companies: ExecutiveCompanySnapshot[];
}
