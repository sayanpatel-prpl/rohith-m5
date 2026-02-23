/**
 * EXEC-05: Narrative Risks (Talk vs Walk)
 *
 * Displays disconnects between company narrative and actual performance.
 * Red disconnects (overpromise) at top, green stealth signals below.
 */

import { clsx } from "clsx";
import type { NarrativeRisk } from "@/types/executive";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import { Badge } from "@/components/ui/Badge";

interface NarrativeRisksProps {
  risks: NarrativeRisk[];
  className?: string;
}

export function NarrativeRisks({ risks, className }: NarrativeRisksProps) {
  if (risks.length === 0) {
    return (
      <div className={clsx("rounded-lg bg-surface-raised p-lg", className)}>
        <h3 className="text-sm font-semibold text-text-primary mb-sm uppercase tracking-wide">
          Talk vs Walk
        </h3>
        <p className="text-sm text-text-muted">No narrative disconnects detected.</p>
      </div>
    );
  }

  // Red disconnects first, green stealth signals second
  const sorted = [...risks].sort((a, b) => {
    if (a.disconnect === b.disconnect) return 0;
    return a.disconnect === "red" ? -1 : 1;
  });

  return (
    <div className={clsx("rounded-lg bg-surface-raised p-lg", className)}>
      <h3 className="text-sm font-semibold text-text-primary mb-md uppercase tracking-wide">
        Talk vs Walk
        <span className="ml-2 text-text-muted font-normal text-xs">({risks.length})</span>
      </h3>

      <div className="space-y-2">
        {sorted.map((risk, i) => (
          <div
            key={i}
            className="p-3 rounded border border-border-default bg-surface/50 space-y-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-text-primary">
                {risk.company}
              </span>
              <Badge
                variant={risk.disconnect === "red" ? "danger" : "success"}
                size="sm"
              >
                {risk.disconnect === "red" ? "Disconnect" : "Stealth Signal"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide block mb-0.5">
                  Claim
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {risk.claim}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide block mb-0.5">
                  Reality
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {risk.reality}
                </p>
              </div>
            </div>

            <SourceAttribution source={risk.source} compact />
          </div>
        ))}
      </div>
    </div>
  );
}
