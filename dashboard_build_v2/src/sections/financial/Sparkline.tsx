/**
 * FINP-02: Inline Sparkline Chart
 *
 * Renders a tiny line chart (default 50x20) for embedding inside table cells.
 * Uses BaseChart with minimal ECharts configuration -- no axes, no tooltips,
 * no legends. The last data point gets a small dot marker.
 *
 * Falls back to "-" when data is empty or all null.
 */

import { useMemo } from "react";
import { BaseChart } from "@/components/charts/BaseChart";

interface SparklineProps {
  /** Array of numeric values (e.g., revenue or margin per quarter) */
  data: number[];
  /** Chart width in pixels */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Line color -- defaults to var(--color-chart-1) */
  color?: string;
}

export function Sparkline({
  data,
  width = 50,
  height = 20,
  color,
}: SparklineProps) {
  // If data is empty or all values are missing, show placeholder
  const hasData = data.length > 0 && data.some((v) => v != null && isFinite(v));

  const option = useMemo(() => {
    if (!hasData) return null;

    const lineColor = color ?? "var(--color-chart-1)";

    return {
      animation: false,
      grid: { left: 0, right: 0, top: 0, bottom: 0 },
      xAxis: {
        type: "category" as const,
        show: false,
        data: data.map((_, i) => i),
      },
      yAxis: {
        type: "value" as const,
        show: false,
      },
      series: [
        {
          type: "line" as const,
          data,
          smooth: true,
          showSymbol: true,
          symbol: "circle",
          symbolSize: (
            _value: number,
            params: { dataIndex: number },
          ) => (params.dataIndex === data.length - 1 ? 3 : 0),
          lineStyle: { width: 1.5, color: lineColor },
          itemStyle: { color: lineColor },
          areaStyle: undefined,
        },
      ],
      tooltip: { show: false },
    };
  }, [data, hasData, color]);

  if (!hasData || !option) {
    return (
      <span className="text-text-muted text-[10px] inline-block w-[50px] text-center">
        -
      </span>
    );
  }

  return (
    <div
      className="inline-block align-middle"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      <BaseChart option={option} height={height} />
    </div>
  );
}
