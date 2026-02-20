/**
 * FINP-04: Talk vs Walk Comparison Panel
 *
 * Cross-references management commentary (from Sovrenn concall highlights
 * and growth triggers) against hard financial data to surface narrative
 * disconnects and stealth signals.
 *
 * - Red "Disconnect" badge: management narrative is more optimistic than reality
 * - Green "Stealth Signal" badge: data is better than management suggests
 */

import { getSovrennCompany } from "@/data/loaders/sovrenn";
import type { FinancialRowMetrics } from "@/types/financial";

interface TalkVsWalkProps {
  companyId: string;
  companyName: string;
  metrics: FinancialRowMetrics;
  performance: string;
}

type SignalType = "disconnect" | "stealth";

interface ClaimVsReality {
  category: string;
  claim: string;
  reality: string;
  signal: SignalType;
}

/**
 * Generate claim-vs-reality pairs by cross-referencing sovrenn intelligence
 * with actual financial metrics.
 */
function generatePairs(
  companyId: string,
  metrics: FinancialRowMetrics,
): ClaimVsReality[] {
  const sovrenn = getSovrennCompany(companyId);
  if (!sovrenn) return [];

  const pairs: ClaimVsReality[] = [];

  // -- 1. Revenue Growth Narrative --
  const latestResult = sovrenn.quarterlyResults[0];
  if (latestResult) {
    const tag = latestResult.tag?.toUpperCase() ?? "";
    const hasPositiveTag =
      tag.includes("GOOD RESULTS") || tag.includes("EXCELLENT RESULTS");
    const hasPoorTag = tag.includes("POOR RESULTS");

    if (hasPositiveTag && metrics.revenueGrowth !== null && metrics.revenueGrowth < 0) {
      pairs.push({
        category: "Revenue Growth",
        claim: `Management reported "${latestResult.tag}" for ${latestResult.quarter}`,
        reality: `Revenue actually declined ${metrics.revenueGrowth.toFixed(1)}% YoY`,
        signal: "disconnect",
      });
    } else if (
      !hasPositiveTag &&
      !hasPoorTag &&
      metrics.revenueGrowth !== null &&
      metrics.revenueGrowth > 10
    ) {
      pairs.push({
        category: "Revenue Growth",
        claim: "No positive management commentary despite strong numbers",
        reality: `Revenue grew ${metrics.revenueGrowth.toFixed(1)}% YoY -- under-communicated strength`,
        signal: "stealth",
      });
    } else if (hasPoorTag && metrics.revenueGrowth !== null && metrics.revenueGrowth < 0) {
      pairs.push({
        category: "Revenue Growth",
        claim: `Management acknowledged "${latestResult.tag}" for ${latestResult.quarter}`,
        reality: `Revenue declined ${metrics.revenueGrowth.toFixed(1)}% YoY, consistent with commentary`,
        signal: "disconnect",
      });
    }
  }

  // -- 2. Margin Trajectory --
  const triggers = sovrenn.keyGrowthTriggers.join(" ").toLowerCase();
  const mentionsMargin =
    triggers.includes("margin") ||
    triggers.includes("ebitda") ||
    triggers.includes("operating profit");

  // Sector average EBITDA margin approximation (~10% for consumer durables)
  const SECTOR_AVG_MARGIN = 10;

  if (
    mentionsMargin &&
    metrics.ebitdaMargin !== null &&
    metrics.ebitdaMargin < SECTOR_AVG_MARGIN
  ) {
    pairs.push({
      category: "Margin Trajectory",
      claim: "Management highlights margin improvement in growth triggers",
      reality: `EBITDA margin at ${metrics.ebitdaMargin.toFixed(1)}% is below sector average of ~${SECTOR_AVG_MARGIN}%`,
      signal: "disconnect",
    });
  } else if (
    !mentionsMargin &&
    metrics.ebitdaMargin !== null &&
    metrics.ebitdaMargin > SECTOR_AVG_MARGIN
  ) {
    pairs.push({
      category: "Margin Trajectory",
      claim: "Management does not highlight margin strength in commentary",
      reality: `EBITDA margin at ${metrics.ebitdaMargin.toFixed(1)}% is above sector average -- quiet outperformance`,
      signal: "stealth",
    });
  }

  // -- 3. Growth Outlook --
  const mentionsGrowth =
    triggers.includes("growth") ||
    triggers.includes("expansion") ||
    triggers.includes("capacity");
  const isOptimistic = mentionsGrowth && sovrenn.keyGrowthTriggers.length >= 2;

  if (
    isOptimistic &&
    metrics.profitGrowth !== null &&
    metrics.profitGrowth < -5
  ) {
    pairs.push({
      category: "Growth Outlook",
      claim: `Management cites ${sovrenn.keyGrowthTriggers.length} growth triggers including expansion plans`,
      reality: `Profit growth at ${metrics.profitGrowth.toFixed(1)}% YoY contradicts optimistic outlook`,
      signal: "disconnect",
    });
  } else if (
    !isOptimistic &&
    metrics.profitGrowth !== null &&
    metrics.profitGrowth > 15
  ) {
    pairs.push({
      category: "Growth Outlook",
      claim: "Limited growth narrative from management",
      reality: `Profit growing at ${metrics.profitGrowth.toFixed(1)}% YoY -- execution ahead of narrative`,
      signal: "stealth",
    });
  }

  return pairs;
}

const SIGNAL_CONFIG: Record<
  SignalType,
  { label: string; bgClass: string; textClass: string }
> = {
  disconnect: {
    label: "Disconnect",
    bgClass: "bg-[color-mix(in_oklch,var(--color-negative)_12%,transparent)]",
    textClass: "text-negative",
  },
  stealth: {
    label: "Stealth Signal",
    bgClass: "bg-[color-mix(in_oklch,var(--color-positive)_12%,transparent)]",
    textClass: "text-positive",
  },
};

export function TalkVsWalk({
  companyId,
  companyName,
  metrics,
}: TalkVsWalkProps) {
  const pairs = generatePairs(companyId, metrics);

  if (pairs.length === 0) {
    const sovrenn = getSovrennCompany(companyId);
    if (!sovrenn) {
      return (
        <div className="py-8 text-center text-text-muted text-sm">
          Management commentary not available for {companyName}
        </div>
      );
    }
    return (
      <div className="py-8 text-center text-text-muted text-sm">
        No significant narrative disconnects detected for {companyName}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-muted">
        Comparing management commentary (Sovrenn) against financial data
        (Screener/Trendlyne)
      </p>

      {pairs.map((pair) => {
        const config = SIGNAL_CONFIG[pair.signal];
        return (
          <div
            key={pair.category}
            className="rounded-lg border border-border bg-surface p-3 space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-text-primary uppercase tracking-wide">
                {pair.category}
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.bgClass} ${config.textClass}`}
              >
                {config.label}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Management Says */}
              <div className="rounded-md bg-[color-mix(in_oklch,var(--color-info)_8%,transparent)] p-2.5">
                <span className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">
                  Management Says
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {pair.claim}
                </p>
              </div>

              {/* Data Shows */}
              <div className="rounded-md bg-surface-raised p-2.5">
                <span className="block text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">
                  Data Shows
                </span>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {pair.reality}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <p className="text-[10px] text-text-muted text-right">
        Source: Sovrenn Intelligence + Screener.in financial data
      </p>
    </div>
  );
}
