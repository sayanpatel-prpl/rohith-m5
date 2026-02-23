/**
 * Deals & Transactions section type definitions.
 *
 * Extends SectionData with typed deal entries, A&M angle tagging,
 * and AI-detected deal patterns across the sector.
 * Used by the Deals & Transactions section (DEAL-01 through DEAL-03).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";
import type { ConfidenceLevel } from "./common";

// ---------------------------------------------------------------------------
// A&M Angle (DEAL-01)
// ---------------------------------------------------------------------------

/** A&M advisory service angle for a deal */
export type AMAngle =
  | "CDD Opportunity"
  | "Integration Support"
  | "Carve-out Advisory"
  | "Valuation"
  | "Restructuring";

// ---------------------------------------------------------------------------
// Deal Type
// ---------------------------------------------------------------------------

/** Classification of deal activity */
export type DealType =
  | "acquisition"
  | "investment"
  | "qip"
  | "land-allotment"
  | "rating"
  | "fundraise"
  | "partnership"
  | "other";

// ---------------------------------------------------------------------------
// Deal Entry
// ---------------------------------------------------------------------------

/** A single deal or transaction event */
export interface DealEntry {
  /** Unique deal identifier */
  id: string;
  /** Company canonical ID */
  companyId: string;
  /** Company display name */
  companyName: string;
  /** Deal classification */
  dealType: DealType;
  /** Human-readable deal type label */
  dealTypeLabel: string;
  /** Deal description */
  description: string;
  /** Deal value in INR Crore, null if undisclosed */
  valueCr: number | null;
  /** Date string of the deal (e.g., "1st Dec 2025") */
  date: string;
  /** ISO-8601 date for sorting */
  dateISO: string;
  /** A&M advisory angle for this deal (DEAL-01) */
  amAngle: AMAngle;
  /** Brief rationale for why this A&M angle applies */
  amAngleRationale: string;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Deal Pattern (DEAL-02)
// ---------------------------------------------------------------------------

/** AI-detected pattern across deal activity */
export interface DealPattern {
  /** Pattern name/label */
  pattern: string;
  /** Confidence level of the pattern detection */
  confidence: ConfidenceLevel;
  /** IDs of deals supporting this pattern */
  supportingDealIds: string[];
  /** Human-readable explanation of the pattern */
  explanation: string;
}

// ---------------------------------------------------------------------------
// Deal Summary Stats
// ---------------------------------------------------------------------------

/** Aggregate statistics for the deals section header */
export interface DealSummaryStats {
  /** Total number of deals */
  totalDeals: number;
  /** Total disclosed deal value in INR Crore */
  totalValueCr: number;
  /** Number of unique companies with deal activity */
  activeCompanies: number;
  /** Most common deal type */
  dominantDealType: string;
  /** Most common A&M angle */
  dominantAMAngle: AMAngle;
}

// ---------------------------------------------------------------------------
// Deals Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Deals & Transactions section */
export interface DealsData extends SectionData {
  /** All deal entries across companies */
  deals: DealEntry[];
  /** AI-detected patterns across deal activity (DEAL-02) */
  patterns: DealPattern[];
  /** Aggregate summary statistics */
  summaryStats: DealSummaryStats;
}
