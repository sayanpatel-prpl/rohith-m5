/**
 * Deals & Transactions section stub.
 *
 * Phase 3 will flesh out: M&A activity tracker, capex announcements,
 * JV/partnership timeline, and deal flow analysis.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function DealsTransactions() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Deals & Transactions
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          M&A, capex, and strategic partnerships
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 3:</span>{" "}
          M&A activity tracker, capex expansion announcements, JV and
          partnership timeline, deal flow analysis, and capacity addition
          tracking across the sector.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
