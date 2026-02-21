/**
 * Competitive Moves & Strategic Bets section.
 *
 * Shows competitive intelligence for the Indian Consumer Durables sector.
 * COMP-01: Real data from Sovrenn sources with source attribution
 * COMP-02: Competitive Intensity Heatmap (Company x MoveType matrix)
 * COMP-03: Cross-links to Operations for moves with operational implications
 *
 * Layout: Summary Stats -> Intensity Heatmap -> Filter Bar -> Move Cards
 */

import { useState, useMemo } from "react";
import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { CompetitiveData } from "@/types/competitive";
import type { MoveType } from "@/types/competitive";

import { CompetitiveHeatmap } from "./CompetitiveHeatmap";
import { MoveCard } from "./MoveCard";
import { MoveSummaryStats } from "./MoveSummaryStats";

/** Move type display labels for filter bar */
const MOVE_TYPE_LABELS: Record<MoveType, string> = {
  "capacity-expansion": "Capacity Expansion",
  "new-product": "New Product",
  acquisition: "Acquisition",
  partnership: "Partnership",
  geographic: "Geographic",
  technology: "Technology",
  pricing: "Pricing",
  other: "Other",
};

export default function CompetitiveMoves() {
  const { data, isPending, error } =
    useFilteredData<CompetitiveData>("competitive");
  const [typeFilter, setTypeFilter] = useState<MoveType | "all">("all");

  // Compute move counts per type for filter bar display
  const moveTypeCounts = useMemo(() => {
    if (!data?.moves) return new Map<MoveType, number>();
    const counts = new Map<MoveType, number>();
    for (const move of data.moves) {
      counts.set(move.moveType, (counts.get(move.moveType) ?? 0) + 1);
    }
    return counts;
  }, [data?.moves]);

  // Apply local move type filter
  const filteredMoves = useMemo(() => {
    if (!data?.moves) return [];
    if (typeFilter === "all") return data.moves;
    return data.moves.filter((m) => m.moveType === typeFilter);
  }, [data?.moves, typeFilter]);

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">
          Failed to load Competitive Moves & Strategic Bets
        </p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { summaryStats, intensityMatrix, crossLinkOperationsIds } = data;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Competitive Moves & Strategic Bets
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Strategic positioning, market share dynamics, and competitive
          intelligence
        </p>
      </header>

      {/* Summary Stats */}
      <MoveSummaryStats stats={summaryStats} />

      {/* Competitive Intensity Heatmap (COMP-02) */}
      <CompetitiveHeatmap matrix={intensityMatrix} />

      {/* COMP-03: Cross-link note to Operations */}
      {crossLinkOperationsIds.length > 0 && (
        <p className="text-[10px] text-text-muted italic">
          {crossLinkOperationsIds.length} compan
          {crossLinkOperationsIds.length === 1 ? "y has" : "ies have"} moves
          with operational implications -- see Operational Intelligence section.
        </p>
      )}

      {/* Move Type Filter + Move Timeline */}
      <div className="space-y-sm">
        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-text-secondary">
            Filter:
          </span>

          {/* "All" button */}
          <button
            onClick={() => setTypeFilter("all")}
            className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
              typeFilter === "all"
                ? "bg-brand-primary text-white border-brand-primary"
                : "bg-surface-raised text-text-secondary border-border-default hover:border-brand-primary/50"
            }`}
          >
            All ({data.moves.length})
          </button>

          {/* Per-type buttons (only show types with at least 1 move) */}
          {(Object.keys(MOVE_TYPE_LABELS) as MoveType[]).map((mt) => {
            const count = moveTypeCounts.get(mt) ?? 0;
            if (count === 0) return null;

            return (
              <button
                key={mt}
                onClick={() => setTypeFilter(mt)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  typeFilter === mt
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-surface-raised text-text-secondary border-border-default hover:border-brand-primary/50"
                }`}
              >
                {MOVE_TYPE_LABELS[mt]} ({count})
              </button>
            );
          })}
        </div>

        {/* Move cards */}
        {filteredMoves.length === 0 ? (
          <div className="rounded border border-border-default bg-surface-raised p-lg text-center">
            <p className="text-sm text-text-muted italic">
              {data.moves.length === 0
                ? "No competitive moves detected in current data sources."
                : `No ${typeFilter} moves found. Try a different filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            {filteredMoves.map((move) => (
              <MoveCard key={move.id} move={move} />
            ))}
          </div>
        )}
      </div>

      {/* Data freshness footer */}
      {(data.dataAsOf || data.lastUpdated) && (
        <footer className="text-[10px] text-text-muted text-right pt-sm border-t border-border-default">
          {data.dataAsOf && <span>Data as of {data.dataAsOf}</span>}
          {data.dataAsOf && data.lastUpdated && <span> | </span>}
          {data.lastUpdated && <span>Last updated {data.lastUpdated}</span>}
        </footer>
      )}
    </section>
  );
}
