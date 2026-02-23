import clsx from "clsx";
import { ConfidenceBadge } from "../../components/ui/ConfidenceBadge";
import type { ConfidenceLevel } from "../../types/common";
import type { LeadershipGovernanceData } from "../../types/sections";

interface AuditorFlagsProps {
  flags: LeadershipGovernanceData["auditorFlags"];
}

const severityStyles: Record<ConfidenceLevel, string> = {
  high: "border-l-negative bg-negative/5",
  medium: "border-l-brand-accent bg-brand-accent/5",
  low: "border-l-neutral bg-neutral/5",
};

export function AuditorFlags({ flags }: AuditorFlagsProps) {
  if (flags.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold text-text-primary mb-sm">
        {"\u26A0"} Auditor Flags
      </h3>
      <div className="space-y-sm">
        {flags.map((flag, i) => (
          <div
            key={i}
            className={clsx(
              "border border-surface-overlay rounded p-md border-l-2",
              severityStyles[flag.severity],
            )}
          >
            <div className="flex items-center justify-between gap-sm mb-xs">
              <span className="text-xs font-medium text-text-primary">
                {flag.company}
              </span>
              <ConfidenceBadge level={flag.severity} />
            </div>
            <p className="text-xs text-text-secondary font-medium mb-xs">
              {flag.flag}
            </p>
            <p className="text-xs text-text-muted leading-relaxed">
              {flag.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
