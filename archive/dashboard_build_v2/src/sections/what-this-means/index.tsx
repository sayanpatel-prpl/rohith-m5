/**
 * What This Means For... section.
 *
 * WTMF-01: 4 stakeholder tabs (PE/Investors, Founders, COOs/CFOs, Supply Chain Heads)
 * WTMF-02: Each insight tagged with A&M Recommended Service via AMServiceLineTag
 * WTMF-03: Cross-navigation links to source sections
 * TVW-05: PE/Investors tab includes Talk vs Walk disconnect insights
 *
 * Layout: Header with tab summary -> Tab navigation -> Insight cards -> Footer
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useFilteredData } from "@/hooks/use-filtered-data";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { WhatThisMeansData, StakeholderTab } from "@/types/what-this-means";

/** Tab labels for display */
const TAB_LABELS: Record<StakeholderTab, string> = {
  "pe-investors": "PE/Investors",
  founders: "Founders",
  "coo-cfo": "COOs/CFOs",
  "supply-chain": "Supply Chain Heads",
};

/** Ordered tab keys for iteration */
const TAB_ORDER: StakeholderTab[] = [
  "pe-investors",
  "founders",
  "coo-cfo",
  "supply-chain",
];

export default function WhatThisMeans() {
  const { data, isPending, error } =
    useFilteredData<WhatThisMeansData>("what-this-means");
  const [activeTab, setActiveTab] = useState<StakeholderTab>("pe-investors");
  const navigate = useNavigate();
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  if (isPending) {
    return <SectionSkeleton variant="cards" />;
  }

  if (error) {
    return (
      <div className="p-lg text-center text-negative">
        <p className="font-medium">
          Failed to load What This Means For...
        </p>
        <p className="text-xs text-text-muted mt-xs">
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      </div>
    );
  }

  if (!data) return null;

  // Build insight count per tab from the tabs summary
  const tabCountMap = new Map(data.tabs.map((t) => [t.tab, t.insightCount]));

  // Filter insights for the active tab
  const activeInsights = data.insights.filter(
    (insight) => insight.stakeholderTab === activeTab
  );

  return (
    <section className="space-y-md animate-fade-in">
      {/* Header */}
      <header>
        <h2 className="text-xl font-semibold text-text-primary">
          What This Means For...
        </h2>
        <p className="text-sm text-text-secondary mt-xs">
          Stakeholder-specific intelligence insights
        </p>

        {/* Tab summary badges */}
        <div className="flex items-center gap-2 mt-sm flex-wrap">
          {TAB_ORDER.map((tab) => {
            const count = tabCountMap.get(tab) ?? 0;
            return (
              <span
                key={tab}
                className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-surface-overlay text-text-muted"
              >
                <span className="font-medium">{TAB_LABELS[tab]}</span>
                <span className="text-text-secondary">{count}</span>
              </span>
            );
          })}
        </div>
      </header>

      {/* Tab navigation (WTMF-01) */}
      <div className="border-b border-border-default">
        <nav className="flex gap-0 -mb-px" role="tablist">
          {TAB_ORDER.map((tab) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-brand-accent text-brand-accent"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </nav>
      </div>

      {/* Insight cards for active tab */}
      {activeInsights.length === 0 ? (
        <div className="rounded border border-border-default bg-surface-raised p-lg text-center">
          <p className="text-sm text-text-muted italic">
            No insights available for this stakeholder group
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
          {activeInsights.map((insight) => (
            <div
              key={insight.id}
              className="rounded border border-border-default bg-surface-raised p-4 space-y-2"
            >
              {/* Top row: headline + A&M service tag (WTMF-02) */}
              <div className="flex items-start justify-between gap-2">
                <span className="font-medium text-text-primary text-sm leading-snug">
                  {insight.headline}
                </span>
                <AMServiceLineTag
                  serviceLine={insight.recommendedService}
                  size="sm"
                  className="shrink-0"
                />
              </div>

              {/* Detail */}
              <p className="text-sm text-text-secondary">
                {insight.detail}
              </p>

              {/* Companies */}
              {insight.companyIds.length > 0 && (
                <p className="text-xs text-text-muted">
                  {insight.companyIds.join(", ")}
                </p>
              )}

              {/* Footer: Cross-navigation link (WTMF-03) + Source */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() =>
                    navigate(
                      `/${tenantSlug}/report/${insight.linkedSectionId}`
                    )
                  }
                  className="text-xs text-brand-accent hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>-&gt;</span>
                  <span>View in {insight.linkedSectionLabel}</span>
                </button>

                <SourceAttribution source={insight.source} compact />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Section-level source attribution (tier 4 derived) */}
      <footer className="pt-sm border-t border-border-default">
        <SourceAttribution
          source={{
            source: "Cross-section analysis",
            confidence: "derived",
            tier: 4,
            lastUpdated: data.lastUpdated ?? new Date().toISOString().split("T")[0],
          }}
        />
      </footer>
    </section>
  );
}
