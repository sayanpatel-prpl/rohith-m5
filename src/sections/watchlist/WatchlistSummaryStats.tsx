import { StatCard } from "../../components/ui/StatCard";
import type { WatchlistData } from "../../types/sections";

interface WatchlistSummaryStatsProps {
  data: WatchlistData;
}

export function WatchlistSummaryStats({ data }: WatchlistSummaryStatsProps) {
  return (
    <div className="grid grid-cols-4 gap-md">
      <StatCard
        label="Fundraise Signals"
        value={String(data.fundraiseSignals.length)}
      />
      <StatCard
        label="Margin Inflection"
        value={String(data.marginInflectionCandidates.length)}
      />
      <StatCard
        label="Consolidation Targets"
        value={String(data.consolidationTargets.length)}
      />
      <StatCard
        label="Stress Indicators"
        value={String(data.stressIndicators.length)}
      />
    </div>
  );
}
