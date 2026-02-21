/**
 * OPER-02: A&M Operations Diagnostic Triggers
 *
 * Card listing companies that exceed operational thresholds. Each trigger
 * shows the company, trigger description, actual value vs threshold, and
 * the recommended A&M service line.
 */

import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source";
import type { DiagnosticTrigger } from "@/types/operations";

interface DiagnosticTriggersProps {
  triggers: DiagnosticTrigger[];
}

export function DiagnosticTriggers({ triggers }: DiagnosticTriggersProps) {
  return (
    <div className="bg-surface-raised border border-border-default rounded p-md">
      <div className="flex items-center gap-2 mb-sm">
        <h3 className="text-sm font-semibold text-text-primary">
          A&M Operations Diagnostic Triggers
        </h3>
        <AMServiceLineTag serviceLine="Operations" size="sm" />
      </div>

      {triggers.length === 0 ? (
        <p className="text-xs text-text-secondary">
          No diagnostic triggers detected -- all companies within operational norms.
        </p>
      ) : (
        <div className="space-y-2">
          {triggers.map((trigger, idx) => (
            <div
              key={`${trigger.companyId}-${idx}`}
              className="flex flex-wrap items-start gap-x-3 gap-y-1 text-xs border-t border-border-default pt-2 first:border-t-0 first:pt-0"
            >
              {/* Company name */}
              <span className="font-medium text-text-primary min-w-[120px]">
                {trigger.company}
              </span>

              {/* Trigger description */}
              <span className="text-text-secondary flex-1 min-w-[160px]">
                {trigger.trigger}
              </span>

              {/* Value vs threshold badge */}
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{
                  color: "var(--color-negative)",
                  backgroundColor: "color-mix(in oklch, var(--color-negative) 10%, transparent)",
                }}
              >
                {trigger.metric}: {fmtValue(trigger.value)} vs {fmtValue(trigger.threshold)}
              </span>

              {/* A&M service line */}
              <AMServiceLineTag serviceLine={trigger.amServiceLine} size="sm" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-sm pt-sm border-t border-border-default">
        <SourceAttribution
          source={{
            source: "Screener.in, Trendlyne",
            confidence: "derived",
            tier: "T1",
            lastUpdated: "2025-01",
          }}
          compact
        />
      </div>
    </div>
  );
}

/** Format trigger value -- integers for days, 1 decimal for ratios/percentages */
function fmtValue(val: number): string {
  if (val == null || isNaN(val)) return "-";
  return Number.isInteger(val) ? String(val) : val.toFixed(1);
}
