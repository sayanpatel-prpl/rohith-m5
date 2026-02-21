/**
 * Market Pulse section.
 *
 * Provides macro context for BD opportunity identification.
 * Displays demand signals, input cost trends, A&M thought leadership,
 * and policy tracker -- all with source attribution and data confidence.
 *
 * MRKT-01: Data confidence labels (Verified / Mgmt Guidance)
 * MRKT-02: A&M implication column in commodity table
 * MRKT-03: A&M thought leadership callout box
 * MRKT-04: Verified data: demand signals, input costs, policy tracker
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { MarketPulseData } from "@/types/market-pulse";
import type { NewsItem } from "@/types/news";

import { AMThoughtLeadership } from "./AMThoughtLeadership";
import { DemandSignals } from "./DemandSignals";
import { InputCostTrends } from "./InputCostTrends";
import { PolicyTracker } from "./PolicyTracker";

export default function MarketPulse() {
  const { data, isPending, error } = useFilteredData<MarketPulseData>("market-pulse");

  // NEWS-06: graceful empty state
  const newsItems: NewsItem[] = [];

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Market Pulse</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Market Pulse
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Macro context for BD opportunity identification -- demand signals, input costs, and policy landscape
        </p>
      </header>

      {/* A&M Thought Leadership callout (MRKT-03) -- prominent position */}
      {data.amThoughtLeadership && (
        <AMThoughtLeadership
          title={data.amThoughtLeadership.title}
          summary={data.amThoughtLeadership.summary}
          url={data.amThoughtLeadership.url}
          source={data.amThoughtLeadership.source}
        />
      )}

      {/* Demand Signals (MRKT-01, MRKT-04) */}
      <DemandSignals signals={data.demandSignals} />

      {/* Input Cost Trends with A&M Implications (MRKT-02, MRKT-04) */}
      <InputCostTrends
        inputCosts={data.inputCosts}
        commodityOutlook={data.commodityOutlook}
      />

      {/* Policy Tracker (MRKT-04) */}
      <PolicyTracker policies={data.policyTracker ?? []} />

      {/* NEWS_DATA_SLOT */}
      {newsItems.length > 0 && (
        <div className="rounded border border-border-default bg-surface-raised p-md">
          <h3 className="text-sm font-medium text-text-primary mb-sm">
            Related News
          </h3>
          {newsItems.map((item) => (
            <p key={item.id} className="text-xs text-text-secondary">
              {item.headline}
            </p>
          ))}
        </div>
      )}

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
