/**
 * Sub-Sector Deep Dive section type definitions.
 *
 * Extends SectionData with sub-sector breakdowns, margin levers with
 * evidence from real data, and A&M benchmark case studies.
 * Used by the Deep Dive section (SSDD-01, SSDD-02).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";

// ---------------------------------------------------------------------------
// Sub-Sector Classification
// ---------------------------------------------------------------------------

/** Sub-sector IDs matching the company registry */
export type SubSectorId = "AC" | "Kitchen" | "Electrical" | "EMS" | "Mixed" | "Cooler";

// ---------------------------------------------------------------------------
// Margin Levers (SSDD-01)
// ---------------------------------------------------------------------------

/** A margin improvement lever with real-data evidence */
export interface MarginLever {
  /** Lever identifier */
  lever: string;
  /** Sub-sectors where this lever is applicable */
  applicableSubSectors: SubSectorId[];
  /** Description of potential impact */
  potentialImpact: string;
  /** Current evidence from data (joined trigger texts) */
  currentEvidence: string;
  /** Companies actively pursuing this lever */
  companiesActive: string[];
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Sub-Sector Breakdown (SSDD-01)
// ---------------------------------------------------------------------------

/** Quartile statistics for a sub-sector */
export interface QuartileStats {
  /** 25th percentile */
  p25: number;
  /** Median (50th percentile) */
  median: number;
  /** 75th percentile */
  p75: number;
}

/** Per-sub-sector aggregate breakdown */
export interface SubSectorBreakdown {
  /** Sub-sector identifier */
  subSector: SubSectorId;
  /** Human-readable label */
  label: string;
  /** Number of companies in this sub-sector */
  companyCount: number;
  /** Average revenue growth YoY across sub-sector */
  avgRevenueGrowth: number;
  /** Average EBITDA margin across sub-sector */
  avgEbitdaMargin: number;
  /** Average ROCE across sub-sector */
  avgROCE: number;
  /** Company with highest revenue growth */
  topPerformer: string;
  /** Company with lowest revenue growth */
  bottomPerformer: string;
  /** OPM quartile distribution */
  opmQuartiles: QuartileStats;
  /** Revenue quartile distribution */
  revenueQuartiles: QuartileStats;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// A&M Benchmarks (SSDD-02)
// ---------------------------------------------------------------------------

/** A&M case study benchmark reference */
export interface AMBenchmark {
  /** Benchmark title */
  title: string;
  /** Geography of the case study */
  geography: string;
  /** Key metric improved */
  metric: string;
  /** Metric improvement value */
  value: string;
  /** Detailed case study description */
  detail: string;
  /** Applicability to Indian consumer durables */
  applicability: string;
}

// ---------------------------------------------------------------------------
// Deep Dive Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Sub-Sector Deep Dive section */
export interface DeepDiveData extends SectionData {
  /** Per-sub-sector aggregate breakdowns (SSDD-01) */
  subSectors: SubSectorBreakdown[];
  /** Margin improvement levers with evidence (SSDD-01) */
  marginLevers: MarginLever[];
  /** A&M benchmark case studies (SSDD-02) */
  amBenchmarks: AMBenchmark[];
}
