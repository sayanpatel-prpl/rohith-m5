/**
 * Competitive Summary Stats
 *
 * Renders a row of 4 stat cards: Total Moves, Active Companies,
 * Dominant Move Type, and Avg Moves/Company.
 * Uses inline StatCard pattern consistent with leadership/index.tsx.
 */

import type { CompetitiveSummaryStats } from "@/types/competitive";

interface MoveSummaryStatsProps {
  stats: CompetitiveSummaryStats;
}

export function MoveSummaryStats({ stats }: MoveSummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
      <StatCard label="Total Moves" value={String(stats.totalMoves)} />
      <StatCard
        label="Active Companies"
        value={String(stats.activeCompanies)}
      />
      <StatCard label="Dominant Type" value={stats.dominantMoveType} />
      <StatCard
        label="Avg Moves/Company"
        value={stats.avgMovesPerCompany.toFixed(1)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline StatCard (section-specific, lightweight)
// ---------------------------------------------------------------------------

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-sm">
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className="text-lg font-semibold text-text-primary">{value}</p>
    </div>
  );
}
