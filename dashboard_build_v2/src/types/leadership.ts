/**
 * Leadership & Governance section type definitions.
 *
 * Extends SectionData with governance risk scores, promoter holding
 * trends, leadership changes, and A&M service line implications.
 * Used by the Leadership & Governance section (LEAD-01 through LEAD-03).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";
import type { AMServiceLine } from "./am-theme";

// ---------------------------------------------------------------------------
// Governance Risk Scoring (LEAD-02)
// ---------------------------------------------------------------------------

/** Traffic-light governance risk level */
export type GovernanceRiskLevel = "red" | "amber" | "green";

/** Per-company governance risk assessment */
export interface GovernanceRiskScore {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Traffic-light risk score */
  score: GovernanceRiskLevel;
  /** Contributing risk factors (human-readable) */
  factors: string[];
  /** Recommended A&M service line based on risk pattern */
  amServiceLine: AMServiceLine;
  /** Source attribution for the scoring data */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Promoter Holding Trends (LEAD-03)
// ---------------------------------------------------------------------------

/** Single quarter shareholding snapshot */
export interface ShareholdingSnapshot {
  /** Period label (e.g., "Dec 2025") */
  period: string;
  /** Promoter holding percentage */
  promoterPct: number;
  /** FII holding percentage */
  fiiPct: number;
  /** DII holding percentage */
  diiPct: number;
  /** Public holding percentage */
  publicPct: number;
}

/** Per-company promoter holding trend with A&M implications */
export interface PromoterHoldingEntry {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Latest promoter holding percentage */
  latestPromoterPct: number;
  /** QoQ change in promoter holding (percentage points) */
  changeQoQ: number;
  /** Quarterly shareholding history for charting */
  history: ShareholdingSnapshot[];
  /** A&M service line implication based on holding pattern */
  amServiceLineImplication: string;
  /** Recommended A&M service line */
  amServiceLine: AMServiceLine;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Leadership Timeline (LEAD-01)
// ---------------------------------------------------------------------------

/** Type of leadership event */
export type LeadershipEventType =
  | "promoter-change"
  | "institutional-shift"
  | "management-commentary"
  | "shareholding-alert";

/** A leadership/governance event entry */
export interface LeadershipEvent {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Event date (ISO or descriptive) */
  date: string;
  /** Short event title */
  title: string;
  /** Detailed event description */
  detail: string;
  /** Event type classification */
  type: LeadershipEventType;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

/** Summary statistics for the leadership section header */
export interface LeadershipSummaryStats {
  /** Total companies tracked */
  companiesTracked: number;
  /** Number with governance risk (amber or red) */
  companiesAtRisk: number;
  /** Average promoter holding across sector */
  avgPromoterHolding: number;
  /** Number of companies with promoter decline this quarter */
  promoterDeclineCount: number;
}

// ---------------------------------------------------------------------------
// Leadership Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Leadership & Governance section */
export interface LeadershipData extends SectionData {
  /** Summary stats for header display */
  summaryStats: LeadershipSummaryStats;
  /** Per-company governance risk scores (LEAD-02) */
  governanceRiskScores: GovernanceRiskScore[];
  /** Per-company promoter holding trends with A&M implications (LEAD-03) */
  promoterHoldings: PromoterHoldingEntry[];
  /** Chronological leadership/governance events (LEAD-01) */
  leadershipTimeline: LeadershipEvent[];
}
