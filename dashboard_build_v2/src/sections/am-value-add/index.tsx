/**
 * A&M Value-Add Opportunities section stub.
 *
 * Phase 5 will flesh out: Service line mapping, opportunity scoring,
 * cross-referencing financial distress signals with A&M capabilities,
 * and engagement readiness indicators.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function AMValueAdd() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          A&M Value-Add Opportunities
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Where A&M capabilities align with company needs
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 5:</span>{" "}
          Service line opportunity mapping, engagement readiness scoring,
          cross-referencing financial distress signals with A&M advisory
          capabilities, and pipeline prioritization matrix.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
