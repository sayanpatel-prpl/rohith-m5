/**
 * Operational Intelligence section stub.
 *
 * Phase 4 will flesh out: Manufacturing efficiency metrics, supply chain
 * signals, inventory analysis, and operational KPI benchmarking.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function OperationalIntelligence() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Operational Intelligence
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Manufacturing, supply chain, and operational KPIs
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 4:</span>{" "}
          Manufacturing efficiency metrics, supply chain risk indicators,
          inventory turnover analysis, capacity utilization benchmarks, and
          operational KPI comparison across peer companies.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
