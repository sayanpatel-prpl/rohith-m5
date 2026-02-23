import { useFilteredData } from "../../hooks/use-filtered-data";
import { DataRecencyTag } from "../../components/ui/DataRecencyTag";
import { SectionSkeleton } from "../../components/ui/SectionSkeleton";
import { DemandSignals } from "./DemandSignals";
import { InputCostTrends } from "./InputCostTrends";
import { MarginOutlook } from "./MarginOutlook";
import { ChannelMix } from "./ChannelMix";
import type { MarketPulseData } from "../../types/sections";

/**
 * Market Pulse -- macro industry context dashboard.
 * Shows demand signals, input cost trends, margin outlook, and channel mix shifts.
 * Sector-wide view: company filtering does NOT affect this section.
 */
export default function MarketPulse() {
  const { data, isPending, error } =
    useFilteredData<MarketPulseData>("market-pulse");

  if (isPending) return <SectionSkeleton variant="mixed" />;
  if (error) throw error;
  if (!data) return null;

  return (
    <div className="p-md space-y-md">
      {/* Header row with title + DataRecencyTag */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-display text-text-primary">
          Market Pulse
        </h2>
        <DataRecencyTag dataAsOf={data.dataAsOf} />
      </div>

      {/* Demand signals: 4-column StatCard grid */}
      <DemandSignals signals={data.demandSignals} />

      {/* Charts row: 2-column grid */}
      <div className="grid grid-cols-2 gap-md">
        <InputCostTrends costs={data.inputCosts} history={data.inputCostHistory} />
        <ChannelMix channels={data.channelMix} />
      </div>

      {/* Margin outlook: full-width narrative */}
      <MarginOutlook outlook={data.marginOutlook} />
    </div>
  );
}
