import { Tabs } from "radix-ui";
import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { CompetitiveSummaryStats } from "./CompetitiveSummaryStats";
import { ProductLaunches } from "./ProductLaunches";
import { PricingActions } from "./PricingActions";
import { D2CInitiatives } from "./D2CInitiatives";
import { QCPartnerships } from "./QCPartnerships";
import { ClusterAnalysis } from "./ClusterAnalysis";
import type { CompetitiveMovesData } from "../../types/sections";

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
 * Competitive Moves section.
 * Tracks product launches, pricing actions, D2C initiatives, and quick
 * commerce partnerships across the Indian Consumer Durables sector, with
 * AI cluster analysis grouping companies by competitive strategy.
 */
export default function CompetitiveMoves() {
  const { data, isPending, error } =
    useFilteredData<CompetitiveMovesData>("competitive");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Competitive Moves
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Summary Stats */}
      <CompetitiveSummaryStats data={data} />

      {/* Tabbed move type navigation */}
      <Tabs.Root defaultValue="all">
        <Tabs.List className="flex gap-xs border-b border-surface-overlay mb-md">
          <TabTrigger value="all" label="All Moves" />
          <TabTrigger
            value="launches"
            label="Launches"
            count={data.productLaunches.length}
          />
          <TabTrigger
            value="pricing"
            label="Pricing"
            count={data.pricingActions.length}
          />
          <TabTrigger
            value="d2c"
            label="D2C"
            count={data.d2cInitiatives.length}
          />
          <TabTrigger
            value="partnerships"
            label="Partnerships"
            count={data.qcPartnerships.length}
          />
        </Tabs.List>

        <Tabs.Content value="all">
          <div className="space-y-md">
            <ProductLaunches launches={data.productLaunches} />
            <PricingActions actions={data.pricingActions} />
            <D2CInitiatives initiatives={data.d2cInitiatives} />
            <QCPartnerships partnerships={data.qcPartnerships} />
          </div>
        </Tabs.Content>

        <Tabs.Content value="launches">
          <ProductLaunches launches={data.productLaunches} />
        </Tabs.Content>

        <Tabs.Content value="pricing">
          <PricingActions actions={data.pricingActions} />
        </Tabs.Content>

        <Tabs.Content value="d2c">
          <D2CInitiatives initiatives={data.d2cInitiatives} />
        </Tabs.Content>

        <Tabs.Content value="partnerships">
          <QCPartnerships partnerships={data.qcPartnerships} />
        </Tabs.Content>
      </Tabs.Root>

      {/* Cluster Analysis -- always visible below tabs */}
      <ClusterAnalysis clusters={data.clusterAnalysis} />
    </div>
  );
}
