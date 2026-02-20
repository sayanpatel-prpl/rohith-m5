/**
 * Financial Performance section stub.
 *
 * Priority stub demonstrating the full data pipeline:
 * useFilteredData -> TanStack Query -> data loader -> JSON
 *
 * Phase 2 will flesh out: 15-company financial tracker with sparklines,
 * quarterly comparison tables, margin analysis, and A&M Signal triage.
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SourceAttribution } from "@/components/source";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { SectionData } from "@/types/sections";
import type { SourceTier } from "@/types/source";
import type { NewsItem } from "@/types/news";

const sampleSource = {
  source: "Screener.in",
  confidence: "verified" as const,
  tier: 1 as SourceTier,
  lastUpdated: "2026-02-18",
};

export default function FinancialPerformance() {
  const { data, isPending, error } = useFilteredData<SectionData>("financial");

  // NEWS-06: graceful empty state
  const newsItems: NewsItem[] = [];

  if (isPending) {
    return <SectionSkeleton variant="table" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Financial Performance</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Financial Performance
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Quarterly financials across 15 Consumer Durables companies
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 2:</span>{" "}
          15-company financial tracker with inline sparklines, quarterly revenue
          and margin comparison tables, segment-level breakdown, and A&M Signal
          triage highlighting which companies need advisory intervention.
        </p>

        {data && (
          <p className="text-xs text-text-muted mt-sm">
            Data loaded for section: {data.section}
            {data.dataAsOf ? ` (as of ${data.dataAsOf})` : ""}
          </p>
        )}
      </div>

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

      <SourceAttribution source={sampleSource} />
    </section>
  );
}
