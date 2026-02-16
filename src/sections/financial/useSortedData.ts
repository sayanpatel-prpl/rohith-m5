import { useState, useMemo } from "react";
import type { FinancialPerformanceData } from "../../types/sections";

export type SortField =
  | "name"
  | "revenueGrowthYoY"
  | "ebitdaMargin"
  | "workingCapitalDays"
  | "roce"
  | "debtEquity";

type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

/**
 * Client-side sorting hook for the financial metrics table.
 * Uses useState for sort config and useMemo for derived sorted array.
 * Default sort: company name ascending.
 */
export function useSortedData(
  companies: FinancialPerformanceData["companies"],
) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc",
  });

  const sorted = useMemo(() => {
    const copy = [...companies];
    copy.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      if (sortConfig.field === "name") {
        aVal = a.name;
        bVal = b.name;
        const cmp = (aVal as string).localeCompare(bVal as string);
        return sortConfig.direction === "asc" ? cmp : -cmp;
      }

      aVal = a.metrics[sortConfig.field];
      bVal = b.metrics[sortConfig.field];

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [companies, sortConfig]);

  function toggleSort(field: SortField) {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Same field: toggle direction
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      // New field: name defaults to asc, metrics default to desc (highest-first)
      return {
        field,
        direction: field === "name" ? "asc" : "desc",
      };
    });
  }

  return { sorted, sortConfig, toggleSort };
}
