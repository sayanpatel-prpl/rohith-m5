import { useState, useMemo } from "react";
import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { MetricsTable } from "./MetricsTable";
import { ComparisonView } from "./ComparisonView";
import type { FinancialPerformanceData } from "../../types/sections";

const MAX_COMPARISON = 5;

/**
 * Financial Performance section.
 * Sortable, filterable metrics table for 16 Consumer Durables companies
 * with expandable variance analysis and side-by-side comparison charts.
 */
export default function FinancialPerformance() {
  const { data, rawData, isPending, error } =
    useFilteredData<FinancialPerformanceData>("financial");

  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    [],
  );

  // Toggle comparison selection with max 5 clamp
  function toggleComparison(companyId: string) {
    setSelectedForComparison((prev) => {
      if (prev.includes(companyId)) {
        return prev.filter((id) => id !== companyId);
      }
      if (prev.length >= MAX_COMPARISON) return prev;
      return [...prev, companyId];
    });
  }

  // CRITICAL: Derive comparison companies from rawData (unfiltered) to prevent
  // chart re-render/flicker when the user sorts the table (RESEARCH.md pitfall 5)
  const comparisonCompanies = useMemo(() => {
    if (!rawData || selectedForComparison.length < 2) return [];
    return rawData.companies.filter((c) =>
      selectedForComparison.includes(c.id),
    );
  }, [rawData, selectedForComparison]);

  if (isPending) return <SectionSkeleton variant="table" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  return (
    <div className="space-y-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-display text-text-primary">
          Financial Performance
        </h1>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Metrics table */}
      <MetricsTable
        companies={data.companies}
        selectedIds={selectedForComparison}
        onToggleSelect={toggleComparison}
        maxSelected={MAX_COMPARISON}
      />

      {/* Comparison view (shown when 2+ companies selected) */}
      {comparisonCompanies.length >= 2 && (
        <ComparisonView companies={comparisonCompanies} />
      )}
    </div>
  );
}
