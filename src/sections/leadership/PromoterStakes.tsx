import { Collapsible } from "radix-ui";
import clsx from "clsx";
import { TrendIndicator } from "../../components/ui/TrendIndicator";
import { formatPercent } from "../../lib/formatters";
import type { TrendDirection } from "../../types/common";
import type { LeadershipGovernanceData } from "../../types/sections";

interface PromoterStakesProps {
  stakes: LeadershipGovernanceData["promoterStakeChanges"];
}

function getDirection(changePct: number): TrendDirection {
  if (changePct > 0) return "up";
  if (changePct < 0) return "down";
  return "flat";
}

const directionColor: Record<TrendDirection, string> = {
  up: "text-positive",
  down: "text-negative",
  flat: "text-neutral",
};

export function PromoterStakes({ stakes }: PromoterStakesProps) {
  if (stakes.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary mb-sm">
        Promoter Stake Changes
      </h3>
      <div className="border border-surface-overlay rounded overflow-hidden">
        {stakes.map((stake, i) => {
          const direction = getDirection(stake.changePct);
          return (
            <Collapsible.Root key={i}>
              <div className="flex items-center justify-between py-sm px-md border-b border-surface-overlay">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary truncate">
                    {stake.company}
                  </p>
                  <p className="text-[10px] text-text-muted truncate">
                    {stake.promoterGroup}
                  </p>
                </div>
                <div className="flex items-center gap-md shrink-0">
                  <span className="text-xs text-text-secondary font-mono">
                    {stake.currentPct.toFixed(1)}%
                  </span>
                  <div className="flex items-center gap-xs">
                    <TrendIndicator direction={direction} size="sm" />
                    <span
                      className={clsx("text-xs font-mono", directionColor[direction])}
                    >
                      {formatPercent(stake.changePct)}
                    </span>
                  </div>
                  <Collapsible.Trigger className="text-text-muted text-xs cursor-pointer transition-transform data-[state=open]:rotate-180">
                    {"\u25BE"}
                  </Collapsible.Trigger>
                </div>
              </div>
              <Collapsible.Content className="px-md py-sm bg-surface-raised text-xs text-text-secondary border-b border-surface-overlay leading-relaxed">
                {stake.context}
              </Collapsible.Content>
            </Collapsible.Root>
          );
        })}
      </div>
    </div>
  );
}
