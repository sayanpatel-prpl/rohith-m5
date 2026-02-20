/**
 * Market Pulse section stub.
 *
 * Phase 3 will flesh out: Stock performance tracker, market cap changes,
 * institutional holding shifts, and sector momentum indicators.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function MarketPulse() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Market Pulse
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Stock performance and market sentiment signals
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 3:</span>{" "}
          Stock performance tracker with sparklines, market cap evolution,
          institutional and promoter holding shifts, and sector-wide momentum
          indicators with peer comparison.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
