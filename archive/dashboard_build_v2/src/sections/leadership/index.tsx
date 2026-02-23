/**
 * Leadership & Governance section.
 *
 * Answers "where are the governance risks and opportunities?"
 * LEAD-01: Governance event timeline with source attribution
 * LEAD-02: Per-company governance risk scoring (red/amber/green)
 * LEAD-03: Promoter holding trends with A&M service line annotations
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { LeadershipData } from "@/types/leadership";

import { GovernanceRiskScoring } from "./GovernanceRiskScoring";
import { PromoterHoldings } from "./PromoterHoldings";
import { LeadershipTimeline } from "./LeadershipTimeline";

export default function LeadershipGovernance() {
  const { data, isPending, error } = useFilteredData<LeadershipData>("leadership");

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Leadership & Governance</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const {
    summaryStats,
    governanceRiskScores,
    promoterHoldings,
    leadershipTimeline,
  } = data;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          Leadership & Governance
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Governance risk signals, promoter holding patterns, and A&M opportunity mapping
        </p>
      </header>

      {/* Summary stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
        <StatCard
          label="Companies Tracked"
          value={String(summaryStats.companiesTracked)}
        />
        <StatCard
          label="Governance Risk"
          value={String(summaryStats.companiesAtRisk)}
          accent={summaryStats.companiesAtRisk > 0 ? "negative" : "positive"}
        />
        <StatCard
          label="Avg Promoter %"
          value={`${summaryStats.avgPromoterHolding}%`}
        />
        <StatCard
          label="Promoter Declines"
          value={String(summaryStats.promoterDeclineCount)}
          accent={summaryStats.promoterDeclineCount > 2 ? "negative" : undefined}
        />
      </div>

      {/* Governance Risk Scoring Grid (LEAD-02) */}
      <GovernanceRiskScoring scores={governanceRiskScores} />

      {/* Two-column: Promoter Holdings left, Timeline right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <PromoterHoldings holdings={promoterHoldings} />
        <LeadershipTimeline events={leadershipTimeline} />
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
