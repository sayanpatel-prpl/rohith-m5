import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { WatchlistData } from "../../types/sections";

/**
 * Watchlist & Forward Indicators placeholder section.
 * Proves the full fetch -> cache -> filter -> render pipeline.
 * Full module will be built in Phase 8.
 */
export default function Watchlist() {
  const { data, rawData, isPending, error, filters } =
    useFilteredData<WatchlistData>("watchlist");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  const totalRecords =
    data.fundraiseSignals.length +
    data.marginInflectionCandidates.length +
    data.consolidationTargets.length +
    data.stressIndicators.length;

  const rawTotalRecords =
    rawData.fundraiseSignals.length +
    rawData.marginInflectionCandidates.length +
    rawData.consolidationTargets.length +
    rawData.stressIndicators.length;

  const activeFilters = getActiveFilterSummary(filters);

  return (
    <div className="p-md space-y-md">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Watchlist & Forward Indicators
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
        <div className="text-xs text-text-secondary">
          <span className="font-medium text-text-primary">
            {totalRecords} signals
          </span>
          {totalRecords !== rawTotalRecords && (
            <span className="text-text-muted">
              {" "}
              (of {rawTotalRecords} total)
            </span>
          )}
          <span className="text-text-muted">
            {" "}
            ({data.fundraiseSignals.length} fundraise,{" "}
            {data.marginInflectionCandidates.length} inflection,{" "}
            {data.consolidationTargets.length} consolidation,{" "}
            {data.stressIndicators.length} stress)
          </span>
        </div>

        {activeFilters && (
          <div className="text-xs text-text-muted">
            Active filters: {activeFilters}
          </div>
        )}

        <p className="text-xs text-text-muted italic">
          Full module will be built in Phase 8
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
