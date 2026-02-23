/**
 * Competitive Landscape section type definitions.
 *
 * Extends SectionData with competitive moves extracted from real data,
 * intensity matrix for heatmap visualization, and cross-links to
 * operations section for companies with operational implications.
 * Used by the Competitive section (COMP-01 through COMP-03).
 */

import type { SectionData } from "./sections";
import type { SourceInfo } from "./source";

// ---------------------------------------------------------------------------
// Move Types (COMP-01)
// ---------------------------------------------------------------------------

/** Classification of competitive moves */
export type MoveType =
  | "capacity-expansion"
  | "new-product"
  | "acquisition"
  | "partnership"
  | "geographic"
  | "technology"
  | "pricing"
  | "other";

// ---------------------------------------------------------------------------
// Competitive Move (COMP-01)
// ---------------------------------------------------------------------------

/** A single competitive move by a company */
export interface CompetitiveMove {
  /** Unique move identifier */
  id: string;
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Classification of the move */
  moveType: MoveType;
  /** Human-readable label for the move type */
  moveTypeLabel: string;
  /** Description of the competitive move */
  description: string;
  /** Display date string */
  date: string;
  /** ISO-8601 date for sorting */
  dateISO: string;
  /** Whether this move has operational implications (COMP-03 cross-link) */
  hasOperationalImplication: boolean;
  /** Description of operational implication if any */
  operationalImplication?: string;
  /** Source attribution */
  source: SourceInfo;
}

// ---------------------------------------------------------------------------
// Intensity Matrix (COMP-02)
// ---------------------------------------------------------------------------

/** Single cell in the intensity heatmap */
export interface IntensityCell {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Move type for this cell */
  moveType: MoveType;
  /** Number of moves of this type */
  count: number;
}

/** Row in the intensity heatmap (one per company) */
export interface CompetitiveIntensityRow {
  /** Canonical company ID */
  companyId: string;
  /** Company display name */
  company: string;
  /** Count of moves per move type */
  moveCounts: Record<MoveType, number>;
  /** Total moves across all types */
  totalMoves: number;
}

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

/** Summary statistics for the competitive section header */
export interface CompetitiveSummaryStats {
  /** Total competitive moves detected */
  totalMoves: number;
  /** Number of companies with at least one move */
  activeCompanies: number;
  /** Most common move type label */
  dominantMoveType: string;
  /** Average moves per company */
  avgMovesPerCompany: number;
}

// ---------------------------------------------------------------------------
// Competitive Section Data
// ---------------------------------------------------------------------------

/** Complete data payload for the Competitive Landscape section */
export interface CompetitiveData extends SectionData {
  /** Summary stats for header display */
  summaryStats: CompetitiveSummaryStats;
  /** All competitive moves sorted by date descending (COMP-01) */
  moves: CompetitiveMove[];
  /** Company-by-move-type intensity matrix for heatmap (COMP-02) */
  intensityMatrix: CompetitiveIntensityRow[];
  /** Company IDs cross-linked to operations section (COMP-03) */
  crossLinkOperationsIds: string[];
}
