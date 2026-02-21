/**
 * Competitive Landscape section data adapter.
 *
 * Builds CompetitiveData by extracting competitive moves from:
 * - sovrenn: growth triggers (classified into move types)
 * - sovrenn: deal activity (acquisitions, investments, land allotments)
 *
 * Builds an intensity matrix for heatmap visualization and cross-links
 * to operations section for companies with operational implications.
 *
 * Never fabricates data. All moves come from real Sovrenn intelligence.
 */

import { getSovrennData } from "../loaders/sovrenn";
import type { SovrennCompany, SovrennDealActivity } from "../loaders/sovrenn";
import { getCompanyById } from "../companies";

import type {
  CompetitiveData,
  CompetitiveMove,
  MoveType,
  CompetitiveIntensityRow,
  CompetitiveSummaryStats,
} from "../../types/competitive";
import type { SourceInfo } from "../../types/source";

// ---------------------------------------------------------------------------
// Source helpers
// ---------------------------------------------------------------------------

function sovrennSource(lastUpdated: string): SourceInfo {
  return {
    source: "Sovrenn Intelligence curated analysis",
    confidence: "derived",
    tier: 3,
    lastUpdated,
  };
}

// ---------------------------------------------------------------------------
// Move Type Classification
// ---------------------------------------------------------------------------

interface MoveTypeRule {
  type: MoveType;
  label: string;
  pattern: RegExp;
}

const MOVE_TYPE_RULES: MoveTypeRule[] = [
  {
    type: "capacity-expansion",
    label: "Capacity Expansion",
    pattern: /capacity|plant|facility|greenfield|manufacturing/i,
  },
  {
    type: "new-product",
    label: "New Product",
    pattern: /new.*product|launch|range|model|sku/i,
  },
  {
    type: "acquisition",
    label: "Acquisition",
    pattern: /acqui|bought|acquired|merger/i,
  },
  {
    type: "partnership",
    label: "Partnership",
    pattern: /partner|jv|joint venture|collaboration|alliance/i,
  },
  {
    type: "geographic",
    label: "Geographic Expansion",
    pattern: /international|export|global|overseas|foreign market/i,
  },
  {
    type: "technology",
    label: "Technology",
    pattern: /technology|digital|automation|ai|iot|r&d|innovation/i,
  },
  {
    type: "pricing",
    label: "Pricing",
    pattern: /pricing|price|cost.*leader|premium/i,
  },
];

function classifyMoveType(text: string): { type: MoveType; label: string } {
  for (const rule of MOVE_TYPE_RULES) {
    if (rule.pattern.test(text)) {
      return { type: rule.type, label: rule.label };
    }
  }
  return { type: "other", label: "Other" };
}

// ---------------------------------------------------------------------------
// Operational Implication Detection (COMP-03)
// ---------------------------------------------------------------------------

function getOperationalImplication(
  moveType: MoveType,
  _description: string,
): { has: boolean; detail?: string } {
  if (moveType === "capacity-expansion") {
    return {
      has: true,
      detail:
        "Capacity expansion impacts manufacturing operations, supply chain, and working capital management",
    };
  }
  if (moveType === "technology") {
    return {
      has: true,
      detail:
        "Technology investment affects operational processes, automation, and workforce capabilities",
    };
  }
  return { has: false };
}

// ---------------------------------------------------------------------------
// Date helpers
// ---------------------------------------------------------------------------

/** Parse informal date strings into ISO-8601 for sorting */
function parseDateToISO(dateStr: string): string {
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)\s/i, "$1 ");
  const parsed = new Date(cleaned);
  if (isNaN(parsed.getTime())) {
    return "2025-01-01";
  }
  return parsed.toISOString().split("T")[0];
}

// ---------------------------------------------------------------------------
// Quarterly Result Filter (shared with deals-adapter)
// ---------------------------------------------------------------------------

function isQuarterlyResult(description: string): boolean {
  return /^[\s(]*(?:GOOD|POOR|EXCELLENT|AVERAGE|WEAK|MIXED)?\s*RESULTS?\s*\)/i.test(
    description,
  );
}

// ---------------------------------------------------------------------------
// Move Extraction
// ---------------------------------------------------------------------------

function extractMoves(lastUpdated: string): CompetitiveMove[] {
  const sovrenn = getSovrennData();
  const moves: CompetitiveMove[] = [];
  let moveCounter = 0;

  for (const company of sovrenn) {
    const companyMeta = getCompanyById(company.companyId);
    const companyName =
      companyMeta?.name ?? company.companyName.split(".")[0].trim();
    const companyDate =
      company.quarterlyResults.length > 0
        ? company.quarterlyResults[company.quarterlyResults.length - 1].date
        : "FY2026";

    // Extract from growth triggers
    for (const trigger of company.keyGrowthTriggers) {
      const { type, label } = classifyMoveType(trigger);
      const { has, detail } = getOperationalImplication(type, trigger);

      moveCounter++;
      moves.push({
        id: `move-${moveCounter}`,
        companyId: company.companyId,
        company: companyName,
        moveType: type,
        moveTypeLabel: label,
        description:
          trigger.length > 300 ? trigger.slice(0, 300) + "..." : trigger,
        date: companyDate,
        dateISO: parseDateToISO(companyDate),
        hasOperationalImplication: has,
        operationalImplication: detail,
        source: sovrennSource(lastUpdated),
      });
    }

    // Extract from deal activity (non-quarterly-result entries)
    if (company.dealActivity) {
      for (const deal of company.dealActivity) {
        if (isQuarterlyResult(deal.description)) continue;

        // Only extract competitive moves from deals
        let dealMoveType: MoveType;
        let dealLabel: string;

        if (deal.type === "acquisition" || deal.type === "investment") {
          dealMoveType = "acquisition";
          dealLabel = "Acquisition";
        } else if (
          /allot.*land|acres.*land|land.*allot|manufacturing.*facility/i.test(
            deal.description,
          )
        ) {
          dealMoveType = "capacity-expansion";
          dealLabel = "Capacity Expansion";
        } else {
          // Check if it has deal-like content
          const hasDealContent =
            /acqui|invest|stake|subsidiary|merger|jv|partnership|divest|land|facility/i.test(
              deal.description,
            );
          if (!hasDealContent) continue;

          const classified = classifyMoveType(deal.description);
          dealMoveType = classified.type;
          dealLabel = classified.label;
        }

        const { has, detail } = getOperationalImplication(
          dealMoveType,
          deal.description,
        );

        moveCounter++;
        moves.push({
          id: `move-${moveCounter}`,
          companyId: company.companyId,
          company: companyName,
          moveType: dealMoveType,
          moveTypeLabel: dealLabel,
          description:
            deal.description.length > 300
              ? deal.description.slice(0, 300) + "..."
              : deal.description,
          date: deal.date,
          dateISO: parseDateToISO(deal.date),
          hasOperationalImplication: has,
          operationalImplication: detail,
          source: sovrennSource(lastUpdated),
        });
      }
    }
  }

  return moves;
}

// ---------------------------------------------------------------------------
// Intensity Matrix (COMP-02)
// ---------------------------------------------------------------------------

const ALL_MOVE_TYPES: MoveType[] = [
  "capacity-expansion",
  "new-product",
  "acquisition",
  "partnership",
  "geographic",
  "technology",
  "pricing",
  "other",
];

function buildIntensityMatrix(
  moves: CompetitiveMove[],
): CompetitiveIntensityRow[] {
  const companyMap = new Map<
    string,
    { company: string; counts: Record<MoveType, number> }
  >();

  for (const move of moves) {
    let entry = companyMap.get(move.companyId);
    if (!entry) {
      const emptyCounts: Record<MoveType, number> = {} as Record<MoveType, number>;
      for (const t of ALL_MOVE_TYPES) emptyCounts[t] = 0;
      entry = { company: move.company, counts: emptyCounts };
      companyMap.set(move.companyId, entry);
    }
    entry.counts[move.moveType] = (entry.counts[move.moveType] ?? 0) + 1;
  }

  const rows: CompetitiveIntensityRow[] = [];
  for (const [companyId, entry] of companyMap.entries()) {
    const totalMoves = Object.values(entry.counts).reduce((a, b) => a + b, 0);
    rows.push({
      companyId,
      company: entry.company,
      moveCounts: entry.counts,
      totalMoves,
    });
  }

  // Sort by total moves descending
  rows.sort((a, b) => b.totalMoves - a.totalMoves);
  return rows;
}

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

function computeSummaryStats(
  moves: CompetitiveMove[],
  matrix: CompetitiveIntensityRow[],
): CompetitiveSummaryStats {
  if (moves.length === 0) {
    return {
      totalMoves: 0,
      activeCompanies: 0,
      dominantMoveType: "-",
      avgMovesPerCompany: 0,
    };
  }

  // Find dominant move type
  const typeCounts: Record<string, number> = {};
  for (const m of moves) {
    typeCounts[m.moveTypeLabel] = (typeCounts[m.moveTypeLabel] ?? 0) + 1;
  }
  const dominantMoveType = Object.entries(typeCounts).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  return {
    totalMoves: moves.length,
    activeCompanies: matrix.length,
    dominantMoveType,
    avgMovesPerCompany:
      matrix.length > 0
        ? Math.round((moves.length / matrix.length) * 10) / 10
        : 0,
  };
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Competitive Landscape section data payload */
export function buildCompetitiveData(): CompetitiveData {
  // ALTERNATIVE_DATA_SLOT: DGFT import/export data
  // Integration point: Patent filings as competitive moat signal, Google Trends for market share proxy
  // Expected: getDGFTData() -> company-level import dependency ratios
  //
  // ALTERNATIVE_DATA_SLOT: PLI scheme data
  // Integration point: Patent filings as competitive moat signal, Google Trends for market share proxy
  // Expected: getPLIData() -> company PLI eligibility and disbursement status
  //
  // ALTERNATIVE_DATA_SLOT: Google Trends data
  // Integration point: Patent filings as competitive moat signal, Google Trends for market share proxy
  // Expected: getGoogleTrendsData() -> brand-level search interest indices
  //
  // ALTERNATIVE_DATA_SLOT: Patent filing data
  // Integration point: Patent filings as competitive moat signal, Google Trends for market share proxy
  // Expected: getPatentData() -> company-level patent counts and categories

  const now = new Date().toISOString();

  // Extract all competitive moves
  const moves = extractMoves(now);

  // Sort by dateISO descending
  moves.sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  // Build intensity matrix
  const intensityMatrix = buildIntensityMatrix(moves);

  // Cross-link: companies with operational implications
  const crossLinkOperationsIds = [
    ...new Set(
      moves
        .filter((m) => m.hasOperationalImplication)
        .map((m) => m.companyId),
    ),
  ];

  // Summary stats
  const summaryStats = computeSummaryStats(moves, intensityMatrix);

  return {
    section: "competitive",
    dataAsOf: "FY2026",
    lastUpdated: now,
    summaryStats,
    moves,
    intensityMatrix,
    crossLinkOperationsIds,
  };
}
