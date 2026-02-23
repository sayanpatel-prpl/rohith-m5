import { Tabs } from "radix-ui";
import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { WatchlistSummaryStats } from "./WatchlistSummaryStats";
import { FundraiseSignals } from "./FundraiseSignals";
import { MarginInflection } from "./MarginInflection";
import { ConsolidationTargets } from "./ConsolidationTargets";
import { StressIndicators } from "./StressIndicators";
import type { WatchlistData } from "../../types/sections";

// ---------------------------------------------------------------------------
// Tab trigger helper
// ---------------------------------------------------------------------------

function TabTrigger({
  value,
  label,
  count,
}: {
  value: string;
  label: string;
  count?: number;
}) {
  return (
    <Tabs.Trigger
      value={value}
      className="text-xs px-sm py-xs font-medium text-text-muted data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary transition-colors"
    >
      {label}
      {count != null && (
        <span className="ml-1 text-[10px] text-text-muted">({count})</span>
      )}
    </Tabs.Trigger>
  );
}

// ---------------------------------------------------------------------------
// Main section
// ---------------------------------------------------------------------------

/**
 * Watchlist & Forward Indicators section.
 * 90-day predictive intelligence showing likely fundraises, margin inflection
 * candidates, consolidation targets, and stress indicators.
 */
export default function Watchlist() {
  const { data, isPending, error } =
    useFilteredData<WatchlistData>("watchlist");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Watchlist & Forward Indicators
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Summary Stats */}
      <WatchlistSummaryStats data={data} />

      {/* Tabbed signal navigation */}
      <Tabs.Root defaultValue="all">
        <Tabs.List className="flex gap-xs border-b border-surface-overlay mb-md">
          <TabTrigger value="all" label="All Signals" />
          <TabTrigger
            value="fundraise"
            label="Fundraise"
            count={data.fundraiseSignals.length}
          />
          <TabTrigger
            value="inflection"
            label="Margin Inflection"
            count={data.marginInflectionCandidates.length}
          />
          <TabTrigger
            value="consolidation"
            label="Consolidation"
            count={data.consolidationTargets.length}
          />
          <TabTrigger
            value="stress"
            label="Stress"
            count={data.stressIndicators.length}
          />
        </Tabs.List>

        <Tabs.Content value="all">
          <div className="space-y-md">
            <FundraiseSignals signals={data.fundraiseSignals} />
            <MarginInflection candidates={data.marginInflectionCandidates} />
            <ConsolidationTargets targets={data.consolidationTargets} />
            <StressIndicators indicators={data.stressIndicators} />
          </div>
        </Tabs.Content>

        <Tabs.Content value="fundraise">
          <FundraiseSignals signals={data.fundraiseSignals} />
        </Tabs.Content>

        <Tabs.Content value="inflection">
          <MarginInflection candidates={data.marginInflectionCandidates} />
        </Tabs.Content>

        <Tabs.Content value="consolidation">
          <ConsolidationTargets targets={data.consolidationTargets} />
        </Tabs.Content>

        <Tabs.Content value="stress">
          <StressIndicators indicators={data.stressIndicators} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
