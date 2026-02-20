/**
 * Watchlist & Forward Indicators Section (WTCH-01 through WTCH-04)
 *
 * Displays 4 quadrants of forward-looking signals:
 * - Stress Indicators: companies under financial distress
 * - Likely Fundraises: companies likely to raise capital
 * - Margin Inflection: margin trend reversals (positive or negative)
 * - Consolidation Targets: small-cap underperformers ripe for M&A
 *
 * Each entry shows severity (1-5), A&M service line, source attribution.
 * Stress model methodology is explained in an expandable panel.
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { QuadrantCard } from "./QuadrantCard";
import { StressModelInfo } from "./StressModelInfo";
import { formatDate } from "@/lib/formatters";
import type { WatchlistData } from "@/types/watchlist";
import type { NewsItem } from "@/types/news";

export default function WatchlistForwardIndicators() {
  const { data, isPending, error } = useFilteredData<WatchlistData>("watchlist");

  // NEWS_DATA_SLOT: graceful empty state for future news integration
  const newsItems: NewsItem[] = [];

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">
          Failed to load Watchlist & Forward Indicators
        </p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-md">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Watchlist & Forward Indicators
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Companies requiring attention and forward-looking signals
        </p>
      </header>

      {/* Stress Model methodology panel */}
      {data?.stressModel && <StressModelInfo model={data.stressModel} />}

      {/* 2x2 Quadrant Grid */}
      {data?.quadrants && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
          {/* Top-left: Stress Indicators (red accent) */}
          <QuadrantCard
            title="Stress Indicators"
            icon="!!"
            entries={data.quadrants.stressIndicators}
            accentColor="var(--color-negative)"
            emptyMessage="No stress signals detected"
          />

          {/* Top-right: Likely Fundraises (green accent) */}
          <QuadrantCard
            title="Likely Fundraises"
            icon="$"
            entries={data.quadrants.likelyFundraises}
            accentColor="var(--color-positive)"
            emptyMessage="No fundraise signals detected"
          />

          {/* Bottom-left: Margin Inflection (amber accent) */}
          <QuadrantCard
            title="Margin Inflection"
            icon="~"
            entries={data.quadrants.marginInflection}
            accentColor="var(--color-am-improvement)"
            emptyMessage="No margin inflection detected"
          />

          {/* Bottom-right: Consolidation Targets (blue accent) */}
          <QuadrantCard
            title="Consolidation Targets"
            icon="+"
            entries={data.quadrants.consolidationTargets}
            accentColor="var(--color-brand-accent)"
            emptyMessage="No consolidation targets identified"
          />
        </div>
      )}

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

      {/* Footer: data freshness */}
      {data && (
        <div className="flex items-center justify-between text-xs text-text-muted pt-sm border-t border-surface-overlay">
          {data.dataAsOf && (
            <span>Data as of {formatDate(data.dataAsOf)}</span>
          )}
          {data.lastUpdated && (
            <span>Last updated {formatDate(data.lastUpdated)}</span>
          )}
        </div>
      )}
    </section>
  );
}
