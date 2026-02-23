import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import type { WatchlistData } from "../../types/sections";

interface ConsolidationTargetsProps {
  targets: WatchlistData["consolidationTargets"];
}

export function ConsolidationTargets({ targets }: ConsolidationTargetsProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Consolidation Targets
      </h3>

      {targets.map((target, i) => (
        <div
          key={i}
          className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs"
        >
          <div className="flex items-center gap-sm">
            <span className="text-xs font-semibold text-text-primary">
              {target.company}
            </span>
            <ConfidenceBadge level={target.confidence} />
          </div>

          <p className="text-xs text-text-primary">{target.rationale}</p>

          <div className="flex flex-wrap gap-1">
            {target.likelyAcquirers.map((acquirer) => (
              <span
                key={acquirer}
                className="text-xs bg-surface-overlay px-1.5 py-0.5 rounded text-text-muted"
              >
                {acquirer}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
