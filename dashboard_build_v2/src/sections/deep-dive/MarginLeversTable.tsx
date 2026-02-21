/**
 * SSDD-01, SSDD-03: Margin Levers Analysis Table
 *
 * Displays 5 margin improvement levers with applicable sub-sectors,
 * potential impact, current evidence from Sovrenn data, and active companies.
 * Source attribution line below table per SSDD-03.
 */

import type { MarginLever } from "@/types/deep-dive";

interface MarginLeversTableProps {
  levers: MarginLever[];
}

/** Format lever identifier to title case display name */
function formatLeverName(lever: string): string {
  return lever
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Truncate text to maxLen characters with ellipsis */
function truncate(text: string, maxLen: number): string {
  if (!text) return "-";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

/** Format active companies list: first 3 names + "N more" */
function formatCompanies(companies: string[]): string {
  if (companies.length === 0) return "-";
  const shown = companies.slice(0, 3).join(", ");
  if (companies.length <= 3) return shown;
  return `${shown} + ${companies.length - 3} more`;
}

export function MarginLeversTable({ levers }: MarginLeversTableProps) {
  return (
    <div className="space-y-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border-default text-left text-text-muted">
              <th className="py-2 pr-3 font-medium">Lever</th>
              <th className="py-2 pr-3 font-medium">Applicable Sub-Sectors</th>
              <th className="py-2 pr-3 font-medium">Potential Impact</th>
              <th className="py-2 pr-3 font-medium">Current Evidence</th>
              <th className="py-2 font-medium">Active Companies</th>
            </tr>
          </thead>
          <tbody>
            {levers.map((lever) => (
              <tr
                key={lever.lever}
                className="border-b border-border-default/50 hover:bg-surface-overlay/30"
              >
                <td className="py-2 pr-3 font-medium text-text-primary whitespace-nowrap">
                  {formatLeverName(lever.lever)}
                </td>
                <td className="py-2 pr-3">
                  <div className="flex flex-wrap gap-1">
                    {lever.applicableSubSectors.map((ss) => (
                      <span
                        key={ss}
                        className="inline-block px-1.5 py-0.5 rounded bg-surface-overlay text-[10px] text-text-secondary"
                      >
                        {ss}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-2 pr-3 text-text-secondary">
                  {lever.potentialImpact || "-"}
                </td>
                <td className="py-2 pr-3 text-text-secondary max-w-[200px]">
                  {truncate(lever.currentEvidence, 150)}
                </td>
                <td className="py-2 text-text-secondary">
                  <span className="font-medium text-text-primary">
                    {lever.companiesActive.length}
                  </span>
                  {" -- "}
                  {formatCompanies(lever.companiesActive)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Source attribution line (SSDD-03) */}
      <p className="text-[10px] text-text-muted">
        Source: Sovrenn Intelligence growth triggers analysis | Tier 3
      </p>
    </div>
  );
}
