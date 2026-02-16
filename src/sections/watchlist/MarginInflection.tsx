import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import type { WatchlistData } from "../../types/sections";

interface MarginInflectionProps {
  candidates: WatchlistData["marginInflectionCandidates"];
}

export function MarginInflection({ candidates }: MarginInflectionProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Margin Inflection Candidates
      </h3>

      {candidates.map((candidate, i) => (
        <div
          key={i}
          className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs"
        >
          <div className="flex items-center gap-sm">
            <span className="text-xs font-semibold text-text-primary">
              {candidate.company}
            </span>
            <ConfidenceBadge level={candidate.confidence} />
          </div>

          <div className="text-xs text-text-primary">
            <span>{candidate.currentMarginPct.toFixed(1)}%</span>
            <span className="text-text-muted mx-1">{"\u2192"}</span>
            <span
              className={
                candidate.projectedMarginPct > candidate.currentMarginPct
                  ? "text-positive"
                  : "text-text-primary"
              }
            >
              {candidate.projectedMarginPct.toFixed(1)}%
            </span>
          </div>

          <p className="text-xs text-positive font-medium">
            +
            {(
              candidate.projectedMarginPct - candidate.currentMarginPct
            ).toFixed(1)}
            % improvement
          </p>

          <p className="text-xs text-text-secondary">{candidate.catalyst}</p>
        </div>
      ))}
    </div>
  );
}
