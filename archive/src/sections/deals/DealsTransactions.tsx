import { Tabs } from "radix-ui";
import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { DealSummaryStats } from "./DealSummaryStats";
import { DealTimeline } from "./DealTimeline";
import { DealPatterns } from "./DealPatterns";
import type { DealsTransactionsData } from "../../types/sections";

const DEAL_TYPES = [
  { value: "all", label: "All Deals" },
  { value: "M&A", label: "M&A" },
  { value: "PE/VC", label: "PE/VC" },
  { value: "IPO", label: "IPO" },
  { value: "distressed", label: "Distressed" },
] as const;

/**
 * Deals & Transactions section.
 * Displays deal timeline with type filtering, summary stats, and AI pattern cards.
 */
export default function DealsTransactions() {
  const { data, isPending, error } =
    useFilteredData<DealsTransactionsData>("deals");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Deals & Transactions
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Summary Stats */}
      <DealSummaryStats
        deals={data.deals}
        patternCount={data.aiPatterns.length}
      />

      {/* Tabbed Timeline */}
      <Tabs.Root defaultValue="all">
        <Tabs.List className="flex gap-xs mb-md border-b border-surface-overlay">
          {DEAL_TYPES.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="px-md py-xs text-xs text-text-muted data-[state=active]:text-brand-accent data-[state=active]:border-b-2 data-[state=active]:border-brand-accent transition-colors"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="all">
          <DealTimeline deals={data.deals} />
        </Tabs.Content>

        {DEAL_TYPES.filter((t) => t.value !== "all").map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <DealTimeline
              deals={data.deals.filter((d) => d.type === tab.value)}
            />
          </Tabs.Content>
        ))}
      </Tabs.Root>

      {/* AI Pattern Recognition */}
      <DealPatterns patterns={data.aiPatterns} />
    </div>
  );
}
