/**
 * Deals & Transactions section.
 *
 * Shows deal flow analysis for the Indian Consumer Durables sector.
 * Every deal card displays an A&M Angle tag (DEAL-01).
 * Pattern recognition summary card appears at top (DEAL-02).
 * All deals loaded from data sources with source attribution (DEAL-03).
 *
 * Layout: Summary Stats -> Deal Patterns -> Deal Timeline
 */

import { useState } from "react";
import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { DealsData } from "@/types/deals";
import type { DealType } from "@/types/deals";
import type { NewsItem } from "@/types/news";

import { DealSummaryStats } from "./DealSummaryStats";
import { DealPatterns } from "./DealPatterns";
import { DealCard } from "./DealCard";

/** Deal type filter options */
const DEAL_TYPE_FILTERS: Array<{ value: DealType | "all"; label: string }> = [
  { value: "all", label: "All Types" },
  { value: "acquisition", label: "Acquisitions" },
  { value: "investment", label: "Investments" },
  { value: "qip", label: "QIP" },
  { value: "fundraise", label: "Fundraise" },
  { value: "land-allotment", label: "Land Allotment" },
  { value: "rating", label: "Credit Rating" },
  { value: "partnership", label: "Partnership" },
];

export default function DealsTransactions() {
  const { data, isPending, error } = useFilteredData<DealsData>("deals");
  const [typeFilter, setTypeFilter] = useState<DealType | "all">("all");

  // NEWS-06: graceful empty state
  const _newsItems: NewsItem[] = [];

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Deals & Transactions</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { deals, patterns, summaryStats } = data;

  // Apply local deal type filter
  const filteredDeals =
    typeFilter === "all"
      ? deals
      : deals.filter((d) => d.dealType === typeFilter);

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Deals & Transactions
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          M&A activity, investments, and strategic transactions with A&M advisory angles
        </p>
      </header>

      {/* Summary Stats */}
      <DealSummaryStats stats={summaryStats} />

      {/* Pattern Recognition -- above deal timeline per DEAL-02 */}
      <DealPatterns patterns={patterns} />

      {/* Deal Type Filter + Deal Timeline */}
      <div className="space-y-sm">
        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-text-secondary">Filter:</span>
          {DEAL_TYPE_FILTERS.map((opt) => {
            // Only show filter options that have deals
            const count =
              opt.value === "all"
                ? deals.length
                : deals.filter((d) => d.dealType === opt.value).length;
            if (count === 0 && opt.value !== "all") return null;

            return (
              <button
                key={opt.value}
                onClick={() => setTypeFilter(opt.value)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  typeFilter === opt.value
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-surface-raised text-text-secondary border-border-default hover:border-brand-primary/50"
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Deal cards */}
        {filteredDeals.length === 0 ? (
          <div className="rounded border border-border-default bg-surface-raised p-lg text-center">
            <p className="text-sm text-text-muted italic">
              {deals.length === 0
                ? "No deal activity detected in current data sources."
                : `No ${typeFilter} deals found. Try a different filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
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
