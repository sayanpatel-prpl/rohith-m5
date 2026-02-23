/**
 * BaseChart: Wrapper around echarts-for-react using the tree-shaken echarts instance.
 *
 * Ensures all charts in the dashboard use the same ECharts instance with
 * only the registered chart types, reducing bundle size. Optionally renders
 * source attribution below the chart (SRCA-03).
 */

import { clsx } from "clsx";
import EChartsReactCore from "echarts-for-react/core";
import echarts from "./echarts-core";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { SourceInfo } from "@/types/source";
import type { EChartsOption } from "echarts-for-react/lib/types";

interface BaseChartProps {
  option: EChartsOption;
  height?: string | number;
  loading?: boolean;
  theme?: "light" | "dark";
  className?: string;
  source?: SourceInfo;
}

export function BaseChart({
  option,
  height = 300,
  loading = false,
  theme,
  className,
  source,
}: BaseChartProps) {
  return (
    <div className={clsx("w-full", className)}>
      <EChartsReactCore
        echarts={echarts}
        option={option}
        style={{ height: typeof height === "number" ? `${height}px` : height }}
        showLoading={loading}
        notMerge={true}
        opts={{ renderer: "canvas" }}
        theme={theme}
      />
      {source && (
        <div className="mt-1">
          <SourceAttribution source={source} compact />
        </div>
      )}
    </div>
  );
}
