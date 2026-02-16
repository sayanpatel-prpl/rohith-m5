import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { CompetitiveMovesData } from "../../types/sections";

/**
 * Competitive Moves placeholder section.
 * Proves the full fetch -> cache -> filter -> render pipeline.
 * Full module will be built in Phase 6.
 */
export default function CompetitiveMoves() {
  const { data, rawData, isPending, error, filters } =
    useFilteredData<CompetitiveMovesData>("competitive");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  const totalRecords =
    data.productLaunches.length +
    data.pricingActions.length +
    data.d2cInitiatives.length +
    data.qcPartnerships.length +
    data.clusterAnalysis.length;

  const rawTotalRecords =
    rawData.productLaunches.length +
    rawData.pricingActions.length +
    rawData.d2cInitiatives.length +
    rawData.qcPartnerships.length +
    rawData.clusterAnalysis.length;

  const activeFilters = getActiveFilterSummary(filters);

  return (
    <div className="p-md space-y-md">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Competitive Moves
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
            ({data.productLaunches.length} launches,{" "}
            {data.pricingActions.length} pricing,{" "}
            {data.d2cInitiatives.length} D2C,{" "}
            {data.qcPartnerships.length} QC)
          </span>
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
