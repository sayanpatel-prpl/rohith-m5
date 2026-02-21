/**
 * OPER-01: Operations Metrics Table
 *
 * Per-company operational metrics table with confidence icons on every
 * numeric cell. Column headers for derived metrics (ROCE, CCC) show
 * methodology tooltips. Companies cross-linked to Competitive Moves
 * section display a "(C)" badge next to their name.
 *
 * Sorted alphabetically by company name by default.
 */

import { useMemo, useState } from "react";
import type { OpsMetricRow, ConfidenceIcon as ConfidenceIconType } from "@/types/operations";
import { ConfidenceIcon } from "./ConfidenceIcon";
import { MethodologyTooltip } from "./MethodologyTooltip";

interface OpsMetricsTableProps {
  metrics: OpsMetricRow[];
  crossLinkCompetitiveIds: string[];
}

type SortField =
  | "company"
  | "subSector"
  | "revenueGrowthPct"
  | "ebitdaMarginPct"
  | "opmPct"
  | "rocePct"
  | "workingCapitalDays"
  | "debtEquity"
  | "inventoryDays"
  | "debtorDays"
  | "cashConversionCycle";

type SortDirection = "asc" | "desc";

/** Format number to 1 decimal place, fallback to "-" */
function fmt(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "-";
  return value.toFixed(1);
}

export function OpsMetricsTable({ metrics, crossLinkCompetitiveIds }: OpsMetricsTableProps) {
  const [sortField, setSortField] = useState<SortField>("company");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sorted = useMemo(() => {
    const rows = [...metrics];
    rows.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const dir = sortDirection === "asc" ? 1 : -1;
      if (typeof aVal === "string" && typeof bVal === "string") {
        return aVal.localeCompare(bVal) * dir;
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * dir;
      }
      return 0;
    });
    return rows;
  }, [metrics, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection(field === "company" ? "asc" : "desc");
    }
  };

  const crossSet = useMemo(() => new Set(crossLinkCompetitiveIds), [crossLinkCompetitiveIds]);

  const sortIndicator = (field: SortField) => {
    if (sortField !== field) return "";
    return sortDirection === "asc" ? " \u25B2" : " \u25BC";
  };

  return (
    <div className="overflow-x-auto border border-border-default rounded">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-surface-overlay text-text-secondary font-medium">
            <SortableHeader field="company" current={sortField} onSort={handleSort}>
              Company{sortIndicator("company")}
            </SortableHeader>
            <SortableHeader field="subSector" current={sortField} onSort={handleSort}>
              Sub-Sector{sortIndicator("subSector")}
            </SortableHeader>
            <SortableHeader field="revenueGrowthPct" current={sortField} onSort={handleSort} align="right">
              Rev Growth%{sortIndicator("revenueGrowthPct")}
            </SortableHeader>
            <SortableHeader field="ebitdaMarginPct" current={sortField} onSort={handleSort} align="right">
              EBITDA Margin%{sortIndicator("ebitdaMarginPct")}
            </SortableHeader>
            <SortableHeader field="opmPct" current={sortField} onSort={handleSort} align="right">
              OPM%{sortIndicator("opmPct")}
            </SortableHeader>
            <th className="px-2 py-1.5 text-right cursor-pointer whitespace-nowrap" onClick={() => handleSort("rocePct")}>
              <MethodologyTooltip
                label={`ROCE%${sortIndicator("rocePct")}`}
                methodology="Return on Capital Employed. Primary source: Screener.in financial statements. Fallback: Trendlyne key ratios."
              />
            </th>
            <SortableHeader field="workingCapitalDays" current={sortField} onSort={handleSort} align="right">
              WC Days{sortIndicator("workingCapitalDays")}
            </SortableHeader>
            <SortableHeader field="debtEquity" current={sortField} onSort={handleSort} align="right">
              D/E{sortIndicator("debtEquity")}
            </SortableHeader>
            <SortableHeader field="inventoryDays" current={sortField} onSort={handleSort} align="right">
              Inv Days{sortIndicator("inventoryDays")}
            </SortableHeader>
            <SortableHeader field="debtorDays" current={sortField} onSort={handleSort} align="right">
              Debtor Days{sortIndicator("debtorDays")}
            </SortableHeader>
            <th className="px-2 py-1.5 text-right cursor-pointer whitespace-nowrap" onClick={() => handleSort("cashConversionCycle")}>
              <MethodologyTooltip
                label={`CCC${sortIndicator("cashConversionCycle")}`}
                methodology="Cash Conversion Cycle = Inventory Days + Debtor Days - Days Payable. Source: Screener.in ratio analysis."
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.companyId} className="even:bg-surface-raised border-t border-border-default">
              <td className="px-2 py-1.5 text-left whitespace-nowrap">
                <span className="font-medium text-text-primary">{row.company}</span>
                {crossSet.has(row.companyId) && (
                  <span
                    className="ml-1 text-[9px] text-[var(--color-brand-accent)] font-medium cursor-help"
                    title="Also in Competitive Moves section"
                  >
                    (C)
                  </span>
                )}
              </td>
              <td className="px-2 py-1.5 text-left text-text-secondary whitespace-nowrap">
                {row.subSector ?? "-"}
              </td>
              <MetricCell value={row.revenueGrowthPct} confidence={row.revenueGrowthPctConfidence} />
              <MetricCell value={row.ebitdaMarginPct} confidence={row.ebitdaMarginPctConfidence} />
              <MetricCell value={row.opmPct} confidence={row.opmPctConfidence} />
              <MetricCell value={row.rocePct} confidence={row.rocePctConfidence} />
              <MetricCell value={row.workingCapitalDays} confidence={row.workingCapitalDaysConfidence} />
              <MetricCell value={row.debtEquity} confidence={row.debtEquityConfidence} />
              <MetricCell value={row.inventoryDays} confidence={row.inventoryDaysConfidence} />
              <MetricCell value={row.debtorDays} confidence={row.debtorDaysConfidence} />
              <MetricCell value={row.cashConversionCycle} confidence={row.cashConversionCycleConfidence} />
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={11} className="px-2 py-4 text-center text-text-muted">
                No operational data available for the current filter selection.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

/** Numeric table cell with confidence icon */
function MetricCell({
  value,
  confidence,
}: {
  value: number | null | undefined;
  confidence: ConfidenceIconType;
}) {
  return (
    <td className="px-2 py-1.5 text-right whitespace-nowrap text-text-primary">
      {fmt(value)}
      <ConfidenceIcon confidence={confidence} />
    </td>
  );
}

/** Sortable column header */
function SortableHeader({
  field,
  current,
  onSort,
  align = "left",
  children,
}: {
  field: SortField;
  current: SortField;
  onSort: (field: SortField) => void;
  align?: "left" | "right";
  children: React.ReactNode;
}) {
  return (
    <th
      className={`px-2 py-1.5 cursor-pointer whitespace-nowrap select-none ${
        align === "right" ? "text-right" : "text-left"
      } ${field === current ? "text-text-primary" : ""}`}
      onClick={() => onSort(field)}
    >
      {children}
    </th>
  );
}
