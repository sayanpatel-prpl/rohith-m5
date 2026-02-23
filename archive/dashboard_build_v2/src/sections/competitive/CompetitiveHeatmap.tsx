/**
 * COMP-02: Competitive Intensity Heatmap
 *
 * HTML table grid showing Company x Move Type matrix.
 * Rows sorted by totalMoves descending, columns are move types.
 * Cell background intensity uses color-mix with brand-primary.
 */

import type { CompetitiveIntensityRow, MoveType } from "@/types/competitive";

interface CompetitiveHeatmapProps {
  matrix: CompetitiveIntensityRow[];
}

/** Column definitions: MoveType -> short display label */
const COLUMN_HEADERS: Array<{ key: MoveType | "total"; label: string }> = [
  { key: "capacity-expansion", label: "Cap Exp" },
  { key: "new-product", label: "New Prod" },
  { key: "acquisition", label: "Acq" },
  { key: "partnership", label: "Partner" },
  { key: "geographic", label: "Geo" },
  { key: "technology", label: "Tech" },
  { key: "pricing", label: "Pricing" },
  { key: "other", label: "Other" },
  { key: "total", label: "Total" },
];

/** Returns inline background style based on move count intensity */
function cellBg(count: number): React.CSSProperties {
  if (count === 0) return {};
  if (count === 1) {
    return {
      backgroundColor:
        "color-mix(in oklch, var(--color-brand-primary) 15%, transparent)",
    };
  }
  if (count === 2) {
    return {
      backgroundColor:
        "color-mix(in oklch, var(--color-brand-primary) 30%, transparent)",
    };
  }
  // 3+
  return {
    backgroundColor:
      "color-mix(in oklch, var(--color-brand-primary) 50%, transparent)",
  };
}

export function CompetitiveHeatmap({ matrix }: CompetitiveHeatmapProps) {
  // Sort rows by total moves descending
  const sorted = [...matrix].sort((a, b) => b.totalMoves - a.totalMoves);

  if (sorted.length === 0) {
    return (
      <div className="rounded border border-border-default bg-surface-raised p-sm text-center">
        <p className="text-xs text-text-muted italic">
          No competitive intensity data available.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded border border-border-default bg-surface-raised p-sm space-y-2">
      <h3 className="text-sm font-semibold text-text-primary">
        Competitive Intensity Heatmap
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr>
              <th className="bg-surface-overlay text-[10px] text-text-secondary px-1.5 py-1 text-left font-medium border border-border-default">
                Company
              </th>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.key}
                  className="bg-surface-overlay text-[10px] text-text-secondary px-1.5 py-1 text-center font-medium border border-border-default"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr key={row.companyId}>
                <td className="px-1.5 py-1 text-left text-xs font-medium text-text-primary border border-border-default whitespace-nowrap">
                  {row.company}
                </td>
                {COLUMN_HEADERS.map((col) => {
                  const count =
                    col.key === "total"
                      ? row.totalMoves
                      : row.moveCounts[col.key] ?? 0;
                  const isTotal = col.key === "total";

                  return (
                    <td
                      key={col.key}
                      className={`px-1.5 py-1 text-center border border-border-default ${
                        isTotal ? "font-semibold" : ""
                      }`}
                      style={isTotal ? {} : cellBg(count)}
                    >
                      {count > 0 ? count : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
