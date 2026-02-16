import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { ExecutiveSnapshotData } from "../../types/sections";
import BulletSummary from "./BulletSummary";
import RedFlagsTable from "./RedFlagsTable";

/**
 * Executive Snapshot -- the landing page users see first.
 * Bloomberg-dense briefing with 5 monthly summary bullets,
 * AI narratives, and a red flags table with confidence badges.
 */
export default function ExecutiveSnapshot() {
  const { data, rawData, isPending, error } =
    useFilteredData<ExecutiveSnapshotData>("executive");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data || !rawData) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header: title + data recency */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Executive Snapshot
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Bullet summary -- always shows all bullets (theme-level, not company-filtered) */}
      <BulletSummary bullets={rawData.bullets} />

      {/* Red Flags section */}
      <div className="space-y-xs">
        <div className="flex items-center gap-sm">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wide">
            Red Flags
          </h3>
          <span className="text-[10px] font-medium px-sm py-xs rounded bg-negative/10 text-negative border border-negative/20">
            {data.redFlags.length}
          </span>
        </div>
        <RedFlagsTable redFlags={data.redFlags} />
      </div>
    </div>
  );
}
