/**
 * Sub-Sector Deep Dive section.
 *
 * Answers "which sub-sectors offer the best engagement opportunities?"
 * with granular per-sub-sector metrics, margin lever analysis, and
 * A&M benchmark case study comparisons.
 *
 * SSDD-01: Sub-sector breakdowns with margin levers and evidence
 * SSDD-02: A&M benchmark comparisons (European white goods, US consumer)
 * SSDD-03: Source attribution on all data displays
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { DeepDiveData } from "@/types/deep-dive";

import { SubSectorCards } from "./SubSectorCards";
import { MarginLeversTable } from "./MarginLeversTable";
import { AMBenchmarkCallout } from "./AMBenchmarkCallout";

export default function SubSectorDeepDive() {
  const { data, isPending, error } = useFilteredData<DeepDiveData>("deep-dive");

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Sub-Sector Deep Dive</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { subSectors, marginLevers, amBenchmarks } = data;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Sub-Sector Deep Dive
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Detailed analysis by sub-sector with margin levers and A&M benchmarks
        </p>
      </header>

      {/* Sub-Sector Breakdown Cards (SSDD-01, SSDD-03) */}
      <div className="space-y-sm">
        <h3 className="text-base font-semibold text-text-primary">
          Sub-Sector Breakdown
        </h3>
        <SubSectorCards subSectors={subSectors} />
      </div>

      {/* Margin Levers Analysis (SSDD-01) */}
      <div className="space-y-sm">
        <h3 className="text-base font-semibold text-text-primary">
          Margin Levers Analysis
        </h3>
        <MarginLeversTable levers={marginLevers} />
      </div>

      {/* A&M Benchmark Comparisons (SSDD-02) */}
      <div className="space-y-sm">
        <h3 className="text-base font-semibold text-text-primary">
          A&M Benchmark Comparisons
        </h3>
        <AMBenchmarkCallout benchmarks={amBenchmarks} />
      </div>

      {/* Data freshness footer */}
      {(data.dataAsOf || data.lastUpdated) && (
        <footer className="text-[10px] text-text-muted text-right pt-sm border-t border-border-default">
          {data.dataAsOf && <span>Data as of {data.dataAsOf}</span>}
          {data.dataAsOf && data.lastUpdated && <span> | </span>}
          {data.lastUpdated && <span>Last updated {data.lastUpdated}</span>}
        </footer>
      )}
    </section>
  );
}
