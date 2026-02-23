/**
 * EXEC-04: Red Flags
 *
 * Displays company-level risk flags sorted by severity (highest first).
 * Each flag shows severity indicator, description, service line tag,
 * company name, and source attribution.
 */

import { clsx } from "clsx";
import type { RedFlag } from "@/types/executive";
import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import { SourceAttribution } from "@/components/source/SourceAttribution";

interface RedFlagsProps {
  flags: RedFlag[];
  className?: string;
}

/** Get background tint and text color based on severity */
function getSeverityStyle(severity: number): { bg: string; text: string; label: string } {
  if (severity >= 4) {
    return {
      bg: "color-mix(in oklch, var(--color-negative) 8%, transparent)",
      text: "var(--color-negative)",
      label: severity === 5 ? "Critical" : "High",
    };
  }
  if (severity >= 2) {
    return {
      bg: "color-mix(in oklch, var(--color-am-improvement) 8%, transparent)",
      text: "var(--color-am-improvement)",
      label: severity === 3 ? "Medium" : "Low",
    };
  }
  return {
    bg: "color-mix(in oklch, var(--color-text-muted) 6%, transparent)",
    text: "var(--color-text-muted)",
    label: "Info",
  };
}

/** Render severity dots (filled up to severity level) */
function SeverityDots({ severity }: { severity: number }) {
  return (
    <span className="inline-flex gap-0.5 items-center" title={`Severity: ${severity}/5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor:
              i < severity
                ? getSeverityStyle(severity).text
                : "var(--color-surface-overlay)",
          }}
        />
      ))}
    </span>
  );
}

export function RedFlags({ flags, className }: RedFlagsProps) {
  if (flags.length === 0) {
    return (
      <div className={clsx("rounded-lg bg-surface-raised p-lg", className)}>
        <h3 className="text-sm font-semibold text-text-primary mb-sm uppercase tracking-wide">
          Red Flags
        </h3>
        <p className="text-sm text-text-muted">No red flags detected.</p>
      </div>
    );
  }

  // Sort by severity descending
  const sorted = [...flags].sort((a, b) => b.severity - a.severity);

  return (
    <div className={clsx("rounded-lg bg-surface-raised p-lg", className)}>
      <h3 className="text-sm font-semibold text-text-primary mb-md uppercase tracking-wide">
        Red Flags
        <span className="ml-2 text-text-muted font-normal text-xs">({flags.length})</span>
      </h3>

      <div className="space-y-2">
        {sorted.map((flag, i) => {
          const style = getSeverityStyle(flag.severity);
          return (
            <div
              key={i}
              className="p-3 rounded border border-border-default space-y-1.5"
              style={{ backgroundColor: style.bg }}
            >
              <div className="flex items-center gap-2 flex-wrap">
                <SeverityDots severity={flag.severity} />
                <span
                  className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: style.text }}
                >
                  {style.label}
                </span>
                <span className="text-sm font-semibold text-text-primary">
                  {flag.flag}
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                {flag.detail}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-medium text-text-muted bg-surface-overlay rounded px-1.5 py-0.5">
                  {flag.companyId}
                </span>
                <AMServiceLineTag serviceLine={flag.serviceLine} size="sm" />
                <SourceAttribution source={flag.source} compact className="ml-auto" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
