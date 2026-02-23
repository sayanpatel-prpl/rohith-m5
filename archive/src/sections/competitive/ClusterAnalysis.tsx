import { InsightCard } from "../../components/ui/InsightCard";
import type { CompetitiveMovesData } from "../../types/sections";

interface ClusterAnalysisProps {
  clusters: CompetitiveMovesData["clusterAnalysis"];
}

/** Map cluster name to InsightCard variant */
const clusterVariant: Record<
  string,
  "opportunity" | "pattern" | "risk"
> = {
  "Premium Innovators": "opportunity",
  "Scale Manufacturers": "pattern",
  "Turnaround Candidates": "risk",
};

export function ClusterAnalysis({ clusters }: ClusterAnalysisProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        AI Competitive Strategy Clusters
      </h3>

      {clusters.length === 0 ? (
        <p className="text-xs text-text-muted italic">
          No cluster analysis available.
        </p>
      ) : (
        <div className="space-y-sm">
          {clusters.map((cluster) => (
            <div key={cluster.cluster} className="space-y-xs">
              <InsightCard
                title={cluster.cluster}
                explanation={cluster.outlook}
                confidence="high"
                variant={clusterVariant[cluster.cluster] ?? "pattern"}
              />

              {/* Characteristics */}
              <p className="text-xs text-text-secondary leading-relaxed pl-sm">
                {cluster.characteristics}
              </p>

              {/* Company pills */}
              <div className="inline-flex gap-1 flex-wrap pl-sm">
                {cluster.companies.map((company) => (
                  <span
                    key={company}
                    className="text-xs bg-surface-overlay px-1.5 py-0.5 rounded"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
