/**
 * Market Pulse section type definitions.
 *
 * Extends SectionData with demand signals, input cost trends,
 * commodity outlook, A&M thought leadership callout, and policy tracker.
 * Used by the Market Pulse section (MRKT-01 through MRKT-04).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";

// ---------------------------------------------------------------------------
// Data Confidence (MRKT-01)
// ---------------------------------------------------------------------------

/** 3-tier data confidence system per 03-01 decision */
export type DataConfidence =
  | "Verified"
  | "Management Guidance Interpretation"
  | "Estimated";

// ---------------------------------------------------------------------------
// Demand Signals (MRKT-01, MRKT-04)
// ---------------------------------------------------------------------------

/** A sector or company demand signal extracted from intelligence sources */
export interface DemandSignal {
  /** Short signal label */
  signal: string;
  /** Detailed description */
  detail: string;
  /** Magnitude indicator (e.g., "+44% YoY", "30-35M units by FY30") */
  magnitude: string;
  /** Direction of the signal */
  direction: "positive" | "negative" | "neutral";
  /** Data confidence level (MRKT-01) */
  dataConfidence: DataConfidence;
  /** Source attribution */
  source: SourceInfo;
  /** Companies affected by this signal */
  companiesAffected: string[];
}

// ---------------------------------------------------------------------------
// Input Cost Trends (MRKT-02, MRKT-04)
// ---------------------------------------------------------------------------

/** A commodity or input cost trend entry */
export interface InputCostEntry {
  /** Commodity name (e.g., "Copper", "Aluminium") */
  commodity: string;
  /** Current trend direction */
  trend: "rising" | "falling" | "stable";
  /** QoQ change description or percentage */
  qoqChange: string;
  /** YoY change description or percentage */
  yoyChange: string;
  /** A&M implication for this commodity trend (MRKT-02) */
  amImplication: string;
  /** Data confidence level */
  dataConfidence: DataConfidence;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Commodity Outlook
// ---------------------------------------------------------------------------

/** Sector-wide commodity outlook summary */
export interface CommodityOutlook {
  /** Overall outlook label */
  outlook: string;
  /** Detailed narrative */
  detail: string;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// A&M Thought Leadership (MRKT-03)
// ---------------------------------------------------------------------------

/** A&M thought leadership callout data */
export interface AMThoughtLeadershipData {
  /** Report or article title */
  title: string;
  /** Brief summary (2-3 sentences) */
  summary: string;
  /** URL to the full report on alvarezandmarsal.com */
  url: string;
  /** Source attribution label */
  source: string;
}

// ---------------------------------------------------------------------------
// Policy Tracker (MRKT-04)
// ---------------------------------------------------------------------------

/** A policy entry affecting the sector */
export interface PolicyEntry {
  /** Policy name */
  policy: string;
  /** Policy status */
  status: "active" | "upcoming" | "expired";
  /** Impact description */
  impact: string;
  /** Companies affected by this policy */
  affectedCompanies: string[];
}

// ---------------------------------------------------------------------------
// Market Pulse Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Market Pulse section */
export interface MarketPulseData extends SectionData {
  /** Demand signals extracted from growth triggers and financial data (MRKT-01, MRKT-04) */
  demandSignals: DemandSignal[];
  /** Input cost trends with A&M implications (MRKT-02, MRKT-04) */
  inputCosts: InputCostEntry[];
  /** Sector-wide commodity outlook */
  commodityOutlook: CommodityOutlook | null;
  /** A&M thought leadership callout (MRKT-03) */
  amThoughtLeadership: AMThoughtLeadershipData | null;
  /** Policy tracker entries (MRKT-04) */
  policyTracker: PolicyEntry[];
}
