/**
 * Deal Summary Stats
 *
 * Renders a row of stat cards summarizing deal activity:
 * total deals, total value, active companies, dominant deal type.
 */

import { StatCard } from "@/components/ui/StatCard";
import { formatINRAuto } from "@/lib/formatters";
import type { DealSummaryStats as DealSummaryStatsType } from "@/types/deals";

interface DealSummaryStatsProps {
  stats: DealSummaryStatsType;
}

export function DealSummaryStats({ stats }: DealSummaryStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-sm">
      <StatCard
        label="Total Deals"
        value={String(stats.totalDeals)}
      />
      <StatCard
        label="Total Value"
        value={stats.totalValueCr > 0 ? formatINRAuto(stats.totalValueCr) : "-"}
      />
      <StatCard
        label="Active Companies"
        value={String(stats.activeCompanies)}
      />
      <StatCard
        label="Primary A&M Angle"
        value={stats.dominantAMAngle}
      />
    </div>
  );
}
