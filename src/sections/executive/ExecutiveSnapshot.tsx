import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { ExecutiveSnapshotData } from "../../types/sections";

/**
 * Executive Snapshot placeholder section.
 * Proves the full fetch -> cache -> filter -> render pipeline.
 * Full module will be built in Phase 3.
 */
export default function ExecutiveSnapshot() {
  const { data, rawData, isPending, error, filters } =
    useFilteredData<ExecutiveSnapshotData>("executive");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  const bulletCount = data.bullets.length;
  const redFlagCount = data.redFlags.length;
  const rawBulletCount = rawData.bullets.length;
  const rawRedFlagCount = rawData.redFlags.length;

  const activeFilters = getActiveFilterSummary(filters);

  return (
    <div className="p-md space-y-md">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Executive Snapshot
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
        <div className="text-xs text-text-secondary">
          <span className="font-medium text-text-primary">
            {bulletCount} bullets
          </span>
          {" | "}
          <span className="font-medium text-text-primary">
            {redFlagCount} red flags
          </span>
          {bulletCount !== rawBulletCount || redFlagCount !== rawRedFlagCount ? (
            <span className="text-text-muted">
              {" "}
              (of {rawBulletCount} bullets, {rawRedFlagCount} red flags total)
            </span>
          ) : null}
        </div>

        {activeFilters && (
          <div className="text-xs text-text-muted">
            Active filters: {activeFilters}
          </div>
        )}

        <p className="text-xs text-text-muted italic">
          Full module will be built in Phase 3
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
