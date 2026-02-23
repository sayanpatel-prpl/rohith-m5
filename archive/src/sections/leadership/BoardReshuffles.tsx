import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import { formatDate } from "../../lib/formatters";
import type { LeadershipGovernanceData } from "../../types/sections";

interface BoardReshufflesProps {
  reshuffles: LeadershipGovernanceData["boardReshuffles"];
}

export function BoardReshuffles({ reshuffles }: BoardReshufflesProps) {
  if (reshuffles.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary mb-sm">
        Board Reshuffles
      </h3>
      <div className="space-y-sm">
        {reshuffles.map((reshuffle, i) => (
          <div
            key={i}
            className="bg-surface-raised border border-surface-overlay rounded p-md space-y-xs"
          >
            <div className="flex items-center justify-between gap-sm">
              <span className="text-xs font-medium text-text-primary">
                {reshuffle.company}
              </span>
              <ConfidenceBadge level={reshuffle.significance} />
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {reshuffle.change}
            </p>
            <p className="text-[10px] text-text-muted">
              {formatDate(reshuffle.date)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
