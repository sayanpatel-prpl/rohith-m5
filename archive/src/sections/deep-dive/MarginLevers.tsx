import { useMemo } from "react";
import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import type { SubSectorDeepDiveData } from "../../types/sections";

interface MarginLeversProps {
  levers: SubSectorDeepDiveData["marginLevers"];
}

export function MarginLevers({ levers }: MarginLeversProps) {
  const sorted = useMemo(
    () => [...levers].sort((a, b) => b.impactBps - a.impactBps),
    [levers],
  );

  const maxImpact = sorted.length > 0 ? sorted[0].impactBps : 1;

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Margin Levers
      </h3>

      <div className="space-y-md">
        {sorted.map((lever) => (
          <div key={lever.lever} className="space-y-xs">
            {/* Lever name + impact + feasibility */}
            <div className="flex items-center gap-sm flex-wrap">
              <span className="text-xs text-text-primary font-medium flex-1 min-w-0">
                {lever.lever}
              </span>
              <span className="text-xs font-semibold text-positive shrink-0">
                +{lever.impactBps} bps
              </span>
              <ConfidenceBadge level={lever.feasibility} />
            </div>

            {/* Impact bar */}
            <div className="h-1.5 bg-surface-overlay rounded-full overflow-hidden">
              <div
                className="h-full bg-positive/60 rounded-full transition-all"
                style={{
                  width: `${(lever.impactBps / maxImpact) * 100}%`,
                }}
              />
            </div>

            {/* Explanation */}
            <p className="text-xs text-text-secondary leading-relaxed">
              {lever.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
