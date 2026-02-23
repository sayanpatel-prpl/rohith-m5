import { BarComparisonChart } from "../../components/charts/BarComparisonChart";
import { ChartLegend } from "../../components/charts/ChartLegend";
import { TrendIndicator } from "../../components/ui/TrendIndicator";
import { formatPercent } from "../../lib/formatters";
import type { MarketPulseData } from "../../types/sections";

interface ChannelMixProps {
  channels: MarketPulseData["channelMix"];
}

const BARS_CONFIG = [
  { dataKey: "previous", colorVar: "--color-chart-5", label: "Previous Period" },
  { dataKey: "current", colorVar: "--color-chart-1", label: "Current Period" },
];

export function ChannelMix({ channels }: ChannelMixProps) {
  const chartData = channels.map((ch) => ({
    channel: ch.channel,
    previous: ch.previousSharePct,
    current: ch.currentSharePct,
  }));

  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-sm">
        Channel Mix Shifts
      </h3>

      <BarComparisonChart
        data={chartData}
        bars={BARS_CONFIG}
        xDataKey="channel"
        height={200}
      />

      <ChartLegend
        payload={BARS_CONFIG.map((bar) => ({
          value: bar.label,
          color: `var(${bar.colorVar})`,
        }))}
      />

      <div className="mt-md">
        <div className="grid grid-cols-1 gap-xs">
          {channels.map((ch) => {
            const change = ch.currentSharePct - ch.previousSharePct;
            return (
              <div
                key={ch.channel}
                className="flex items-center justify-between text-xs py-xs border-b border-surface-overlay last:border-b-0"
              >
                <span className="text-text-primary font-medium truncate mr-md">
                  {ch.channel}
                </span>
                <div className="flex items-center gap-md shrink-0">
                  <span className="text-text-muted">
                    {formatPercent(ch.previousSharePct, 1)}
                  </span>
                  <span className="text-text-secondary">
                    {"\u2192"}
                  </span>
                  <span className="text-text-primary">
                    {formatPercent(ch.currentSharePct, 1)}
                  </span>
                  <div className="flex items-center gap-xs">
                    <TrendIndicator direction={ch.trend} size="sm" />
                    <span className="text-text-secondary">
                      {formatPercent(change, 1)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
