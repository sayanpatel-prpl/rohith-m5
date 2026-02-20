/**
 * FINP-03: A&M Engagement Suggestion Card
 *
 * Auto-generates a potential A&M engagement recommendation based on
 * peer-relative financial metrics. Computes median revenue growth,
 * EBITDA margin, and ROCE across all companies and compares the
 * selected company to identify service line fit.
 */

import { AMServiceLineTag } from "@/components/source/AMServiceLineTag";
import type { AMServiceLine } from "@/types/am-theme";
import type { AMActionType } from "@/types/am-theme";
import type { FinancialCompanyRow } from "@/types/financial";
import { formatPercent, formatINRCr } from "@/lib/formatters";

interface EngagementSuggestionProps {
  company: FinancialCompanyRow;
  allCompanies: FinancialCompanyRow[];
}

/** Compute median of a numeric array, ignoring nulls */
function median(values: (number | null)[]): number {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return 0;
  const sorted = [...valid].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Map A&M action type to primary service line */
const SIGNAL_TO_SERVICE_LINE: Record<AMActionType, AMServiceLine> = {
  turnaround: "Restructuring",
  improvement: "CPI",
  transaction: "Transaction Advisory",
  neutral: "Operations",
};

interface PeerComparison {
  label: string;
  company: string;
  peerMedian: string;
  gap: string;
  isNegative: boolean;
}

function buildComparisons(
  company: FinancialCompanyRow,
  medianRevGrowth: number,
  medianEbitdaMargin: number,
  medianRoce: number,
): PeerComparison[] {
  const comparisons: PeerComparison[] = [];
  const m = company.metrics;

  if (m.revenueGrowth !== null) {
    const gap = m.revenueGrowth - medianRevGrowth;
    comparisons.push({
      label: "Revenue Growth",
      company: formatPercent(m.revenueGrowth),
      peerMedian: formatPercent(medianRevGrowth),
      gap: formatPercent(gap),
      isNegative: gap < 0,
    });
  }

  if (m.ebitdaMargin !== null) {
    const gap = m.ebitdaMargin - medianEbitdaMargin;
    comparisons.push({
      label: "EBITDA Margin",
      company: formatPercent(m.ebitdaMargin),
      peerMedian: formatPercent(medianEbitdaMargin),
      gap: formatPercent(gap),
      isNegative: gap < 0,
    });
  }

  if (m.roce !== null) {
    const gap = m.roce - medianRoce;
    comparisons.push({
      label: "ROCE",
      company: formatPercent(m.roce),
      peerMedian: formatPercent(medianRoce),
      gap: formatPercent(gap),
      isNegative: gap < 0,
    });
  }

  return comparisons;
}

function generateSuggestion(
  company: FinancialCompanyRow,
  medianRevGrowth: number,
  medianEbitdaMargin: number,
  medianRoce: number,
): string {
  const m = company.metrics;
  const signal = company.amSignal;

  // Identify specific weaknesses/strengths relative to peer medians
  const weaknesses: string[] = [];
  const strengths: string[] = [];

  if (m.revenueGrowth !== null) {
    if (m.revenueGrowth < medianRevGrowth) {
      weaknesses.push(
        `revenue growth (${formatPercent(m.revenueGrowth)} vs peer median ${formatPercent(medianRevGrowth)})`,
      );
    } else {
      strengths.push(
        `revenue growth (${formatPercent(m.revenueGrowth)} vs peer median ${formatPercent(medianRevGrowth)})`,
      );
    }
  }

  if (m.ebitdaMargin !== null) {
    if (m.ebitdaMargin < medianEbitdaMargin) {
      weaknesses.push(
        `EBITDA margin (${formatPercent(m.ebitdaMargin)} vs peer median ${formatPercent(medianEbitdaMargin)})`,
      );
    } else {
      strengths.push(
        `EBITDA margin (${formatPercent(m.ebitdaMargin)} vs peer median ${formatPercent(medianEbitdaMargin)})`,
      );
    }
  }

  if (m.roce !== null) {
    if (m.roce < medianRoce) {
      weaknesses.push(
        `ROCE (${formatPercent(m.roce)} vs peer median ${formatPercent(medianRoce)})`,
      );
    } else {
      strengths.push(
        `ROCE (${formatPercent(m.roce)} vs peer median ${formatPercent(medianRoce)})`,
      );
    }
  }

  switch (signal) {
    case "turnaround": {
      const areas = weaknesses.length > 0 ? weaknesses.slice(0, 3).join("; ") : "multiple metrics below peer median";
      return `Recommend Restructuring & Turnaround engagement. ${company.name} shows significant underperformance vs peers. Key areas: ${areas}.`;
    }
    case "improvement": {
      const gaps = weaknesses.length > 0 ? weaknesses.slice(0, 2).join("; ") : "operational metrics below sector median";
      return `Recommend CPI engagement. ${company.name} has room for operational improvement: ${gaps}.`;
    }
    case "transaction": {
      const revenueStr = m.revenue !== null ? ` with ${formatINRCr(m.revenue)} revenue` : "";
      const strengthStr = strengths.length > 0 ? strengths[0] : "strong relative performance";
      return `Recommend Transaction Advisory engagement. ${company.name}'s strong performance (${strengthStr}${revenueStr}) makes it an attractive acquisition/IPO candidate.`;
    }
    case "neutral":
    default:
      return `Monitor for emerging opportunities. ${company.name}'s current metrics are broadly in line with sector median. Watch for catalysts that could shift engagement potential.`;
  }
}

export function EngagementSuggestion({
  company,
  allCompanies,
}: EngagementSuggestionProps) {
  // Compute peer medians
  const medianRevGrowth = median(allCompanies.map((c) => c.metrics.revenueGrowth));
  const medianEbitdaMargin = median(allCompanies.map((c) => c.metrics.ebitdaMargin));
  const medianRoce = median(allCompanies.map((c) => c.metrics.roce));

  const serviceLine = SIGNAL_TO_SERVICE_LINE[company.amSignal];
  const suggestion = generateSuggestion(
    company,
    medianRevGrowth,
    medianEbitdaMargin,
    medianRoce,
  );
  const comparisons = buildComparisons(
    company,
    medianRevGrowth,
    medianEbitdaMargin,
    medianRoce,
  );

  return (
    <div className="rounded-lg border border-border bg-surface p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
          Potential A&M Engagement
        </h4>
        <AMServiceLineTag serviceLine={serviceLine} size="sm" />
      </div>

      <p className="text-sm text-text-secondary leading-relaxed">
        {suggestion}
      </p>

      {comparisons.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-1.5 pr-3 font-medium text-text-muted">
                  Metric
                </th>
                <th className="text-right py-1.5 px-3 font-medium text-text-muted">
                  Company
                </th>
                <th className="text-right py-1.5 px-3 font-medium text-text-muted">
                  Peer Median
                </th>
                <th className="text-right py-1.5 pl-3 font-medium text-text-muted">
                  Gap
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((row) => (
                <tr key={row.label} className="border-b border-border/50">
                  <td className="py-1.5 pr-3 text-text-primary">{row.label}</td>
                  <td className="py-1.5 px-3 text-right text-text-primary font-medium">
                    {row.company}
                  </td>
                  <td className="py-1.5 px-3 text-right text-text-muted">
                    {row.peerMedian}
                  </td>
                  <td
                    className={`py-1.5 pl-3 text-right font-medium ${
                      row.isNegative ? "text-negative" : "text-positive"
                    }`}
                  >
                    {row.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[10px] text-text-muted text-right">
        Source: Derived from Screener.in + Trendlyne peer analysis
      </p>
    </div>
  );
}
