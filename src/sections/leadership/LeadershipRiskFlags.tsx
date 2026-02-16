import { InsightCard } from "../../components/ui/InsightCard";
import type { LeadershipGovernanceData } from "../../types/sections";

interface LeadershipRiskFlagsProps {
  flags: LeadershipGovernanceData["aiRiskFlags"];
}

export function LeadershipRiskFlags({ flags }: LeadershipRiskFlagsProps) {
  if (flags.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary mb-sm">
        AI Governance Risk Flags
      </h3>
      <div className="space-y-sm">
        {flags.map((flag, i) => (
          <InsightCard
            key={i}
            title={`${flag.company}: ${flag.riskType}`}
            confidence={flag.confidence}
            explanation={flag.explanation}
            variant="risk"
          />
        ))}
      </div>
    </div>
  );
}
