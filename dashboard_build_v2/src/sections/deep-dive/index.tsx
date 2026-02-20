/**
 * Sub-Sector Deep Dive section stub.
 *
 * Phase 4 will flesh out: AC, Kitchen, Electrical, EMS sub-sector
 * analysis with market sizing, growth drivers, and competitive maps.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function SubSectorDeepDive() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Sub-Sector Deep Dive
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Detailed analysis by sub-sector: AC, Kitchen, Electrical, EMS
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 4:</span>{" "}
          Sub-sector market sizing and growth trajectories, category-specific
          competitive maps, demand driver analysis, seasonality patterns, and
          technology disruption tracking across AC, Kitchen Appliances,
          Electrical Equipment, and EMS segments.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
