/**
 * SSDD-02: A&M Benchmark Comparison Callout Cards
 *
 * Renders A&M case study benchmarks (European white goods, US consumer durables)
 * as branded callout cards with metric highlights and applicability notes.
 */

import type { AMBenchmark } from "@/types/deep-dive";

interface AMBenchmarkCalloutProps {
  benchmarks: AMBenchmark[];
}

export function AMBenchmarkCallout({ benchmarks }: AMBenchmarkCalloutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      {benchmarks.map((benchmark) => (
        <BenchmarkCard key={benchmark.title} benchmark={benchmark} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual Benchmark Card
// ---------------------------------------------------------------------------

function BenchmarkCard({ benchmark }: { benchmark: AMBenchmark }) {
  return (
    <div
      className="border-l-4 border-brand-primary rounded p-md space-y-sm"
      style={{
        backgroundColor:
          "color-mix(in oklch, var(--color-brand-primary) 8%, transparent)",
      }}
    >
      {/* Title + Geography badge */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-sm text-text-primary">
          {benchmark.title}
        </h4>
        <span className="shrink-0 px-1.5 py-0.5 rounded bg-surface-overlay text-[10px] text-text-muted">
          {benchmark.geography}
        </span>
      </div>

      {/* Metric highlight */}
      <div>
        <p className="text-2xl font-bold text-text-primary">
          {benchmark.value}
        </p>
        <p className="text-xs text-text-secondary">{benchmark.metric}</p>
      </div>

      {/* Detail paragraph */}
      <p className="text-xs text-text-secondary leading-relaxed">
        {benchmark.detail}
      </p>

      {/* Applicability to Indian market */}
      <p className="text-xs italic text-text-muted">
        {benchmark.applicability}
      </p>
    </div>
  );
}
