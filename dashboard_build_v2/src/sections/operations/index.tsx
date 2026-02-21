/**
 * Operational Intelligence section.
 *
 * Answers "where are the operational improvement opportunities?"
 * OPER-01: Per-cell confidence indicators on metrics table
 * OPER-02: A&M Operations Diagnostic Triggers
 * OPER-03: Cross-links to Competitive Moves for flagged companies
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { OperationsData } from "@/types/operations";

import { OpsMetricsTable } from "./OpsMetricsTable";
import { DiagnosticTriggers } from "./DiagnosticTriggers";

export default function OperationalIntelligence() {
  const { data, isPending, error } = useFilteredData<OperationsData>("operations");

  if (isPending) {
    return <SectionSkeleton variant="table" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Operational Intelligence</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const {
    summaryStats,
    metrics,
    diagnosticTriggers,
    crossLinkCompetitiveIds,
  } = data;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Operational Intelligence
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Manufacturing efficiency, working capital, and operational KPI benchmarking with A&M diagnostic triggers
        </p>
      </header>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
        <StatCard
          label="Companies Tracked"
          value={String(summaryStats.companiesTracked)}
        />
        <StatCard
          label="Avg EBITDA Margin"
          value={`${summaryStats.avgEbitdaMargin.toFixed(1)}%`}
        />
        <StatCard
          label="Avg ROCE"
          value={`${summaryStats.avgROCE.toFixed(1)}%`}
        />
        <StatCard
          label="Diagnostic Triggers"
          value={String(summaryStats.diagnosticTriggerCount)}
          accent={summaryStats.diagnosticTriggerCount > 0 ? "negative" : "positive"}
        />
      </div>

      {/* Metrics table (OPER-01, OPER-03) */}
      <OpsMetricsTable
        metrics={metrics}
        crossLinkCompetitiveIds={crossLinkCompetitiveIds}
      />

      {/* Diagnostic Triggers card (OPER-02) */}
      <DiagnosticTriggers triggers={diagnosticTriggers} />

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

// ---------------------------------------------------------------------------
// Inline StatCard (section-specific, lightweight)
// ---------------------------------------------------------------------------

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "positive" | "negative";
}) {
  const valueColor =
    accent === "positive"
      ? "text-[var(--color-positive)]"
      : accent === "negative"
        ? "text-[var(--color-negative)]"
        : "text-text-primary";

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-sm">
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}
