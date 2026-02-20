/**
 * Executive Snapshot section.
 *
 * The first thing A&M leadership sees. Answers "what's the opportunity?"
 * with Intelligence Grade, quantified advisory opportunity, and
 * prioritized themes/flags.
 *
 * EXEC-01: Intelligence Grade badge
 * EXEC-02: A&M Opportunity Summary card
 * EXEC-03: Big Themes with source citations
 * EXEC-04: Red Flags with service line tags
 * EXEC-05: Narrative Risks (Talk vs Walk)
 */

import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import type { ExecutiveData } from "@/types/executive";
import type { NewsItem } from "@/types/news";

import { IntelligenceGrade } from "./IntelligenceGrade";
import { OpportunitySummary } from "./OpportunitySummary";
import { BigThemes } from "./BigThemes";
import { RedFlags } from "./RedFlags";
import { NarrativeRisks } from "./NarrativeRisks";

export default function ExecutiveSnapshot() {
  const { data, isPending, error } = useFilteredData<ExecutiveData>("executive");

  // NEWS-06: graceful empty state
  const newsItems: NewsItem[] = [];

  if (isPending) {
    return <SectionSkeleton variant="mixed" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load Executive Snapshot</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const {
    intelligenceGrade,
    opportunitySummary,
    bigThemes,
    redFlags,
    narrativeRisks,
  } = data;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header row: title + Intelligence Grade badge */}
      <header className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">
            Executive Snapshot
          </h2>
          <p className="text-sm text-text-secondary mt-xs">
            Sector-wide intelligence at a glance
          </p>
        </div>
        <IntelligenceGrade grade={intelligenceGrade} />
      </header>

      {/* Opportunity Summary -- the punchline */}
      <OpportunitySummary summary={opportunitySummary} />

      {/* Two-column grid: Big Themes left, Red Flags + Narrative Risks right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
        <BigThemes themes={bigThemes} />

        <div className="space-y-md">
          <RedFlags flags={redFlags} />
          <NarrativeRisks risks={narrativeRisks} />
        </div>
      </div>

      {/* NEWS_DATA_SLOT */}
      {newsItems.length > 0 && (
        <div className="rounded border border-border-default bg-surface-raised p-md">
          <h3 className="text-sm font-medium text-text-primary mb-sm">
            Related News
          </h3>
          {newsItems.map((item) => (
            <p key={item.id} className="text-xs text-text-secondary">
              {item.headline}
            </p>
          ))}
        </div>
      )}

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
