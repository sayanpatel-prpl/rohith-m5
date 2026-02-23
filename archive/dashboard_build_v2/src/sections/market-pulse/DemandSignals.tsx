/**
 * Demand Signals component for Market Pulse section.
 *
 * MRKT-01: Displays data confidence labels (Verified / Mgmt Guidance)
 * instead of ESTIMATED badges. Each signal shows direction, magnitude,
 * confidence badge, and affected companies.
 */

import { clsx } from "clsx";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { DemandSignal, DataConfidence } from "@/types/market-pulse";

interface DemandSignalsProps {
  signals: DemandSignal[];
}

/** Badge styles for each data confidence level */
const CONFIDENCE_STYLES: Record<
  DataConfidence,
  { bg: string; text: string; border: string; label: string }
> = {
  Verified: {
    bg: "bg-positive/10",
    text: "text-positive",
    border: "border-positive/20",
    label: "Verified",
  },
  "Management Guidance Interpretation": {
    bg: "bg-brand-accent/10",
    text: "text-brand-accent",
    border: "border-brand-accent/20",
    label: "Mgmt Guidance",
  },
  Estimated: {
    bg: "bg-negative/10",
    text: "text-negative",
    border: "border-negative/20",
    label: "Estimated",
  },
};

const DIRECTION_ICONS: Record<string, { symbol: string; color: string }> = {
  positive: { symbol: "\u2191", color: "text-positive" },
  negative: { symbol: "\u2193", color: "text-negative" },
  neutral: { symbol: "\u2192", color: "text-text-muted" },
};

export function DemandSignals({ signals }: DemandSignalsProps) {
  if (signals.length === 0) {
    return null;
  }

  return (
    <div className="rounded border border-border-default bg-surface-raised p-md">
      <h3 className="text-sm font-semibold text-text-primary mb-sm">
        Demand Signals
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
        {signals.map((signal, i) => {
          const confidence = CONFIDENCE_STYLES[signal.dataConfidence];
          const dir = DIRECTION_ICONS[signal.direction] ?? DIRECTION_ICONS.neutral;

          return (
            <div
              key={`${signal.signal}-${i}`}
              className="rounded border border-surface-overlay bg-surface-default p-sm space-y-xs"
            >
              {/* Signal header: direction + name */}
              <div className="flex items-start gap-xs">
                <span className={clsx("text-base font-bold mt-px", dir.color)}>
                  {dir.symbol}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-primary leading-snug">
                    {signal.signal}
                  </p>
                </div>
              </div>

              {/* Magnitude + confidence badge */}
              <div className="flex items-center gap-xs flex-wrap">
                <span className="text-xs font-semibold text-text-primary">
                  {signal.magnitude}
                </span>
                <span
                  className={clsx(
                    "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border",
                    confidence.bg,
                    confidence.text,
                    confidence.border,
                  )}
                >
                  {confidence.label}
                </span>
              </div>

              {/* Detail text */}
              <p className="text-xs text-text-secondary line-clamp-2">
                {signal.detail}
              </p>

              {/* Affected companies */}
              {signal.companiesAffected.length > 0 && (
                <p className="text-[10px] text-text-muted">
                  Affects:{" "}
                  {signal.companiesAffected
                    .map((id) => id.charAt(0).toUpperCase() + id.slice(1))
                    .join(", ")}
                </p>
              )}

              {/* Source attribution */}
              <SourceAttribution source={signal.source} compact className="mt-xs" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
