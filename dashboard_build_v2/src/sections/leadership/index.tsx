/**
 * Leadership & Governance section stub.
 *
 * Phase 3 will flesh out: Key management changes, board composition
 * analysis, promoter holding patterns, and governance signals.
 */

import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

export default function LeadershipGovernance() {
  return (
    <section className="space-y-md">
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Leadership & Governance
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Management changes, board composition, and governance signals
        </p>
      </header>

      <div className="rounded border border-border-default bg-surface-raised p-lg">
        <p className="text-sm text-text-secondary">
          <span className="font-medium text-text-primary">Coming in Phase 3:</span>{" "}
          Key management changes tracker, board composition and independence
          analysis, promoter and institutional holding patterns, executive
          compensation benchmarking, and governance quality signals.
        </p>
      </div>

      {/* NEWS_DATA_SLOT */}
    </section>
  );
}
