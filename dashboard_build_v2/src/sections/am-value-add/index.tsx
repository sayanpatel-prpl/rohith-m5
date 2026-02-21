/**
 * A&M Value-Add Opportunities section.
 *
 * AMVA-02: 3-column pipeline/kanban layout (Identified, Qualified, Outreach-Ready).
 * AMVA-03: Opportunity cards with company, engagement type, estimated size, practice area, key data points, source.
 * AMVA-04: Practice area tags using AMServiceLineTag component.
 * AMVA-05: Source section references on every card.
 *
 * Positioned at nav position 2 for A&M presentation.
 * Uses useFilteredData<AMValueAddData>("am-value-add") for data.
 */

import { useMemo } from "react";
import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import { formatINRCr } from "@/lib/formatters";
import type { AMValueAddData, Opportunity, PipelineStage } from "@/types/am-value-add";
import type { NewsItem } from "@/types/news";

// NEWS-06: graceful empty state
const _newsItems: NewsItem[] = [];

/** Max key data points to show before truncating */
const MAX_DATA_POINTS = 3;

/** Column configuration for the 3-stage pipeline */
const PIPELINE_COLUMNS: {
  stage: PipelineStage;
  label: string;
  borderColor: string;
}[] = [
  {
    stage: "identified",
    label: "Identified",
    borderColor: "var(--color-text-muted)",
  },
  {
    stage: "qualified",
    label: "Qualified",
    borderColor: "var(--color-warning)",
  },
  {
    stage: "outreach-ready",
    label: "Outreach-Ready",
    borderColor: "var(--color-positive)",
  },
];

/** Renders a single opportunity card (AMVA-03) */
function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const truncated = opportunity.keyDataPoints.length > MAX_DATA_POINTS;
  const visiblePoints = opportunity.keyDataPoints.slice(0, MAX_DATA_POINTS);
  const remainingCount = opportunity.keyDataPoints.length - MAX_DATA_POINTS;

  return (
    <div className="rounded border border-border-default bg-surface-raised p-3 space-y-2">
      {/* Top row: Company name + Practice area tag */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-text-primary text-sm truncate">
          {opportunity.companyName}
        </span>
        <AMServiceLineTag serviceLine={opportunity.practiceArea} size="sm" />
      </div>

      {/* Engagement type */}
      <p className="text-sm text-text-secondary">{opportunity.engagementType}</p>

      {/* Estimated size (if available) */}
      {opportunity.estimatedSizeCr != null && (
        <p className="text-xs text-text-muted">
          Est. Size: {formatINRCr(opportunity.estimatedSizeCr)}
        </p>
      )}

      {/* Key data points */}
      {visiblePoints.length > 0 && (
        <ul className="space-y-0.5">
          {visiblePoints.map((point, idx) => (
            <li key={idx} className="text-xs text-text-secondary flex gap-1">
              <span className="text-text-muted shrink-0">-</span>
              <span>{point}</span>
            </li>
          ))}
          {truncated && (
            <li className="text-xs text-text-muted italic">
              +{remainingCount} more
            </li>
          )}
        </ul>
      )}

      {/* Footer: Source section reference */}
      <p className="text-[10px] text-text-muted italic">
        Source: {opportunity.sourceSection}
      </p>
    </div>
  );
}

export default function AMValueAdd() {
  const { data, isPending, error } = useFilteredData<AMValueAddData>("am-value-add");

  // Group opportunities by pipeline stage
  const columnData = useMemo(() => {
    if (!data?.opportunities) return null;
    const grouped: Record<PipelineStage, Opportunity[]> = {
      identified: [],
      qualified: [],
      "outreach-ready": [],
    };
    for (const opp of data.opportunities) {
      grouped[opp.pipelineStage].push(opp);
    }
    return grouped;
  }, [data?.opportunities]);

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">Failed to load A&M Value-Add Opportunities</p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const { pipeline, opportunities } = data;
  const totalCount = opportunities.length;

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header area */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          A&M Value-Add Opportunities
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Advisory engagement pipeline sourced from cross-section intelligence
        </p>
      </header>

      {/* Pipeline Summary stat bar */}
      <div className="flex flex-wrap items-center gap-md p-md rounded border border-border-default bg-surface-raised">
        <div className="flex flex-col">
          <span className="text-xs text-text-muted uppercase tracking-wider">
            Total Opportunities
          </span>
          <span className="text-lg font-semibold text-text-primary">
            {totalCount}
          </span>
        </div>

        {pipeline.totalEstimatedValueCr != null && (
          <div className="flex flex-col">
            <span className="text-xs text-text-muted uppercase tracking-wider">
              Est. Total Value
            </span>
            <span className="text-lg font-semibold text-text-primary">
              {formatINRCr(pipeline.totalEstimatedValueCr)}
            </span>
          </div>
        )}

        {/* Stage breakdown */}
        <div className="flex flex-col">
          <span className="text-xs text-text-muted uppercase tracking-wider">
            Pipeline
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-text-secondary">
              {pipeline.identified} Identified
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-xs text-text-secondary">
              {pipeline.qualified} Qualified
            </span>
            <span className="text-text-muted">|</span>
            <span className="text-xs text-text-secondary">
              {pipeline.outreachReady} Outreach-Ready
            </span>
          </div>
        </div>

        {/* Practice area breakdown pills */}
        {pipeline.byPracticeArea.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 ml-auto">
            {pipeline.byPracticeArea.map(({ practiceArea, count }) => (
              <span key={practiceArea} className="inline-flex items-center gap-1">
                <AMServiceLineTag serviceLine={practiceArea} size="sm" />
                <span className="text-[10px] text-text-muted">({count})</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3-column kanban grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {PIPELINE_COLUMNS.map(({ stage, label, borderColor }) => {
          const items = columnData?.[stage] ?? [];
          return (
            <div
              key={stage}
              className="rounded border border-border-default bg-surface"
              style={{ borderLeftWidth: "4px", borderLeftColor: borderColor }}
            >
              {/* Column header */}
              <div className="flex items-center justify-between p-3 border-b border-border-default">
                <h3 className="text-sm font-medium text-text-primary">
                  {label}
                </h3>
                <span className="text-xs text-text-muted bg-surface-overlay px-1.5 py-0.5 rounded-full">
                  {items.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2">
                {items.length > 0 ? (
                  items.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))
                ) : (
                  <p className="text-sm text-text-muted text-center py-6">
                    No opportunities at this stage
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer: SourceAttribution with tier 4 derived source */}
      <SourceAttribution
        source={{
          source: "Cross-Section Analysis (Executive, Financial, Deals, Watchlist, Operations, Competitive)",
          confidence: "derived",
          tier: 4,
          lastUpdated: data.lastUpdated ?? data.dataAsOf ?? new Date().toISOString().split("T")[0],
        }}
      />

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
