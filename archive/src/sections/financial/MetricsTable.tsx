import { useState } from "react";
import clsx from "clsx";
import { useSortedData, type SortField } from "./useSortedData";
import { MetricsTableRow } from "./MetricsTableRow";
import type { FinancialPerformanceData } from "../../types/sections";

interface MetricsTableProps {
  companies: FinancialPerformanceData["companies"];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  maxSelected: number;
}

/** Column definition for sortable headers */
interface ColumnDef {
  field: SortField;
  label: string;
  align: "left" | "right";
}

const COLUMNS: ColumnDef[] = [
  { field: "name", label: "Company", align: "left" },
  { field: "revenueGrowthYoY", label: "Rev. Growth YoY", align: "right" },
  { field: "ebitdaMargin", label: "EBITDA Margin", align: "right" },
  { field: "workingCapitalDays", label: "WC Days", align: "right" },
  { field: "roce", label: "ROCE", align: "right" },
  { field: "debtEquity", label: "D/E", align: "right" },
];

/**
 * Sortable financial metrics table with inline checkboxes and expandable rows.
 * Uses CSS Grid layout (not HTML table) for Radix Collapsible compatibility.
 */
export function MetricsTable({
  companies,
  selectedIds,
  onToggleSelect,
  maxSelected,
}: MetricsTableProps) {
  const { sorted, sortConfig, toggleSort } = useSortedData(companies);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const selectionDisabled = selectedIds.length >= maxSelected;

  function handleToggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="space-y-xs">
      {/* Header row */}
      <div
        className="grid items-center border-b border-surface-overlay"
        style={{
          gridTemplateColumns:
            "32px minmax(140px, 1.5fr) repeat(5, minmax(75px, 1fr)) 36px 32px",
        }}
      >
        {/* Checkbox column header - empty */}
        <div />

        {/* Sortable column headers */}
        {COLUMNS.map((col) => (
          <div
            key={col.field}
            className={clsx(
              "px-sm py-xs",
              col.align === "right" ? "text-right" : "text-left",
            )}
          >
            <button
              onClick={() => toggleSort(col.field)}
              className={clsx(
                "inline-flex items-center gap-xs text-[11px] font-medium cursor-pointer",
                "hover:text-text-primary transition-colors w-full",
                col.align === "right" ? "justify-end" : "justify-start",
                sortConfig.field === col.field
                  ? "text-brand-accent"
                  : "text-text-muted",
              )}
            >
              <span>{col.label}</span>
              <span className="text-[9px]">
                {sortConfig.field === col.field
                  ? sortConfig.direction === "asc"
                    ? "\u25B2"
                    : "\u25BC"
                  : "\u25C6"}
              </span>
            </button>
          </div>
        ))}

        {/* Source column header - empty */}
        <div />
        {/* Expand column header - empty */}
        <div />
      </div>

      {/* Body rows */}
      <div>
        {sorted.map((company) => (
          <MetricsTableRow
            key={company.id}
            company={company}
            isSelected={selectedIds.includes(company.id)}
            onToggleSelect={onToggleSelect}
            isExpanded={expandedId === company.id}
            onToggleExpand={handleToggleExpand}
            selectionDisabled={selectionDisabled}
          />
        ))}
      </div>

      {/* Selection counter and hints */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-md px-sm">
          <span className="text-xs text-text-muted">
            {selectedIds.length} of {maxSelected} selected
          </span>
          {selectedIds.length === 1 && (
            <span className="text-xs text-brand-accent">
              Select 1 more to compare
            </span>
          )}
        </div>
      )}
    </div>
  );
}
