import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { SubSectorDeepDiveData } from "../../types/sections";

/**
 * Sub-Sector Deep Dive placeholder section.
 * Proves the full fetch -> cache -> filter -> render pipeline.
 * Full module will be built in Phase 6.
 */
export default function SubSectorDeepDive() {
  const { data, rawData, isPending, error, filters } =
    useFilteredData<SubSectorDeepDiveData>("deep-dive");

  if (isPending) return <SectionSkeleton variant="chart" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  const costItemCount = data.costsBreakdown.length;
  const rawCostItemCount = rawData.costsBreakdown.length;

  const activeFilters = getActiveFilterSummary(filters);

  return (
    <div className="p-md space-y-md">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Sub-Sector Deep Dive
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
        <div className="text-xs text-text-secondary">
          <span className="font-medium text-text-primary">
            {data.subSector}
          </span>
          {" | "}
          <span className="font-medium text-text-primary">
            {costItemCount} cost items
          </span>
          {costItemCount !== rawCostItemCount && (
            <span className="text-text-muted">
              {" "}
              (of {rawCostItemCount} total)
            </span>
          )}
        </div>

        {activeFilters && (
          <div className="text-xs text-text-muted">
            Active filters: {activeFilters}
          </div>
        )}

        <p className="text-xs text-text-muted italic">
          Full module will be built in Phase 6
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
