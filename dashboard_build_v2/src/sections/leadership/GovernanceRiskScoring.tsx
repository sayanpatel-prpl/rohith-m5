/**
 * LEAD-02: Governance Risk Scoring Grid
 *
 * Per-company governance risk grid with traffic-light color indicators.
 * Red = severe governance concern, Amber = moderate risk, Green = stable.
 * Each card shows risk factors and recommended A&M service line.
 * Sorted by risk severity: red first, then amber, then green.
 */

import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { GovernanceRiskScore, GovernanceRiskLevel } from "@/types/leadership";

interface GovernanceRiskScoringProps {
  scores: GovernanceRiskScore[];
}

/** CSS classes for risk dot colors */
const DOT_CLASSES: Record<GovernanceRiskLevel, string> = {
  red: "bg-[var(--color-negative)]",
  amber: "bg-[var(--color-brand-accent)]",
  green: "bg-[var(--color-positive)]",
};

/** CSS classes for A&M service line text color by risk level */
const TEXT_CLASSES: Record<GovernanceRiskLevel, string> = {
  red: "text-[var(--color-negative)]",
  amber: "text-[var(--color-brand-accent)]",
  green: "text-[var(--color-positive)]",
};

export function GovernanceRiskScoring({ scores }: GovernanceRiskScoringProps) {
  if (scores.length === 0) return null;

  const redCount = scores.filter((s) => s.score === "red").length;
  const amberCount = scores.filter((s) => s.score === "amber").length;
  const greenCount = scores.filter((s) => s.score === "green").length;

  return (
    <div className="space-y-sm">
      <div>
        <h3 className="text-xs font-semibold text-text-primary">
          Governance Risk Scoring
        </h3>
        <p className="text-[10px] text-text-muted mt-0.5">
          Auditor resignation = red | Promoter decline &gt;2% QoQ = amber | Board reconstitution = amber | Stable = green
        </p>
        <div className="flex items-center gap-md mt-xs text-[10px] text-text-secondary">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${DOT_CLASSES.red}`} />
            {redCount} Red
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${DOT_CLASSES.amber}`} />
            {amberCount} Amber
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full inline-block ${DOT_CLASSES.green}`} />
            {greenCount} Green
          </span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-sm">
        {scores.map((entry) => (
          <div
            key={entry.companyId}
            className="bg-surface-raised border border-surface-overlay rounded p-sm"
          >
            {/* Company name + risk dot */}
            <div className="flex items-center gap-1.5 mb-1">
              <span
                className={`w-2 h-2 rounded-full inline-block shrink-0 ${DOT_CLASSES[entry.score]}`}
              />
              <span className="text-xs font-medium text-text-primary truncate">
                {entry.company}
              </span>
            </div>

            {/* Factor list */}
            <div className="text-[10px] text-text-secondary space-y-0.5 mb-1.5">
              {entry.factors.map((factor, idx) => (
                <div key={idx} className="leading-tight">
                  - {factor}
                </div>
              ))}
            </div>

            {/* A&M service line */}
            <div className="flex items-center justify-between">
              <AMServiceLineTag serviceLine={entry.amServiceLine} size="sm" />
              <SourceAttribution source={entry.source} compact className="ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
