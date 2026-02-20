/**
 * Competitive Moves section stub.
 *
 * Phase 4 will flesh out: Competitive positioning matrix, market share
 * dynamics, pricing strategy analysis, and new product launches.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function CompetitiveMoves() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Competitive Moves
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Market positioning, share dynamics, and strategic moves
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 4:</span>{" "}
          Competitive positioning matrix, market share dynamics and shifts,
          pricing strategy analysis, new product launch tracker, and geographic
          expansion moves across the Consumer Durables sector.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
