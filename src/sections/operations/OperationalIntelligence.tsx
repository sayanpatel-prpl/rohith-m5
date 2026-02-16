import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { OperationalIntelligenceData } from "../../types/sections";

/**
 * Operational Intelligence placeholder section.
 * Proves the full fetch -> cache -> filter -> render pipeline.
 * Full module will be built in Phase 5.
 */
export default function OperationalIntelligence() {
  const { data, rawData, isPending, error, filters } =
    useFilteredData<OperationalIntelligenceData>("operations");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  const totalRecords =
    data.supplyChainSignals.length +
    data.manufacturingCapacity.length +
    data.procurementShifts.length +
    data.retailFootprint.length;

  const rawTotalRecords =
    rawData.supplyChainSignals.length +
    rawData.manufacturingCapacity.length +
    rawData.procurementShifts.length +
    rawData.retailFootprint.length;

  const activeFilters = getActiveFilterSummary(filters);

  return (
    <div className="p-md space-y-md">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Operational Intelligence
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
        <div className="text-xs text-text-secondary">
          <span className="font-medium text-text-primary">
            {totalRecords} records
          </span>
          {totalRecords !== rawTotalRecords && (
            <span className="text-text-muted">
              {" "}
              (of {rawTotalRecords} total)
            </span>
          )}
          <span className="text-text-muted">
            {" "}
            ({data.supplyChainSignals.length} supply chain,{" "}
            {data.manufacturingCapacity.length} manufacturing,{" "}
            {data.procurementShifts.length} procurement,{" "}
            {data.retailFootprint.length} retail)
          </span>
        </div>

        {activeFilters && (
          <div className="text-xs text-text-muted">
            Active filters: {activeFilters}
          </div>
        )}

        <p className="text-xs text-text-muted italic">
          Full module will be built in Phase 5
        </p>
      </div>
    </div>
  );
}

function getActiveFilterSummary(filters: {
  companies: string[];
  subCategory: string;
  performanceTier: string;
  timePeriod: string;
}): string | null {
  const parts: string[] = [];
  if (filters.companies.length > 0)
    parts.push(`${filters.companies.length} companies`);
  if (filters.subCategory !== "all") parts.push(filters.subCategory);
  if (filters.performanceTier !== "all") parts.push(filters.performanceTier);
  if (filters.timePeriod !== "YoY") parts.push(filters.timePeriod);
  return parts.length > 0 ? parts.join(", ") : null;
}
