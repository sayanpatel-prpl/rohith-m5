import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import type { SubSectorDeepDiveData } from "../../types/sections";
import { SubSectorHeader } from "./SubSectorHeader";
import { CostBreakdownChart } from "./CostBreakdownChart";
import { CostBreakdownTable } from "./CostBreakdownTable";
import { MarginLevers } from "./MarginLevers";
import { TopQuartileAnalysis } from "./TopQuartileAnalysis";

/**
 * Sub-Sector Deep Dive section.
 *
 * Monthly rotating deep dive into one sub-segment with cost structure
 * benchmarks, margin lever analysis, and top-quartile performance comparison.
 *
 * This is sector-wide analysis -- company filter is a no-op (same pattern as Market Pulse).
 */
export default function SubSectorDeepDive() {
  const { data, isPending, error } =
    useFilteredData<SubSectorDeepDiveData>("deep-dive");

  if (isPending) return <SectionSkeleton variant="chart" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header row with title + DataRecencyTag */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Sub-Sector Deep Dive
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      <SubSectorHeader subSector={data.subSector} />

      {/* Cost structure section: chart (1/3) + table (2/3) */}
      <div className="grid grid-cols-3 gap-md">
        <div className="col-span-1">
          <CostBreakdownChart costs={data.costsBreakdown} />
        </div>
        <div className="col-span-2">
          <CostBreakdownTable costs={data.costsBreakdown} />
        </div>
      </div>

      {/* Analysis sections in 2-column grid */}
      <div className="grid grid-cols-2 gap-md">
        <MarginLevers levers={data.marginLevers} />
        <TopQuartileAnalysis metrics={data.topQuartileAnalysis} />
      </div>
    </div>
  );
}
