/**
 * What This Means For... section stub.
 *
 * Phase 5 will flesh out: Implications analysis for different stakeholders
 * (investors, management, board, creditors), scenario modeling, and
 * actionable recommendations.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function WhatThisMeans() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          What This Means For...
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Implications for investors, management, and stakeholders
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 5:</span>{" "}
          Stakeholder-specific implications analysis (investors, management,
          board, creditors), scenario modeling for key risk/opportunity vectors,
          and actionable recommendations tailored to each audience.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
