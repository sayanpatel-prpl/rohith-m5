import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { ChartTooltip } from "./ChartTooltip";
import { createAnnotation } from "./ChartAnnotation";
import type { ChartAnnotation } from "../../types/common";

interface BarConfig {
  dataKey: string;
  /** CSS custom property name, e.g. "--color-chart-1" */
  colorVar: string;
  label: string;
}

interface BarComparisonChartProps {
  data: Array<Record<string, unknown>>;
  bars: BarConfig[];
  xDataKey: string;
  annotations?: ChartAnnotation[];
  onBarClick?: (dataKey: string, payload: Record<string, unknown>) => void;
  height?: number;
  stacked?: boolean;
}

export function BarComparisonChart({
  data,
  bars,
  xDataKey,
  annotations,
  onBarClick,
  height = 240,
  stacked = false,
}: BarComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 4, left: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-text-muted)"
          opacity={0.15}
        />
        <XAxis
          dataKey={xDataKey}
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={{ stroke: "var(--color-text-muted)", opacity: 0.3 }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={{ stroke: "var(--color-text-muted)", opacity: 0.3 }}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltip />} />
        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.label}
            fill={`var(${bar.colorVar})`}
            stackId={stacked ? "stack" : undefined}
            onClick={(payload: unknown) =>
              onBarClick?.(bar.dataKey, payload as Record<string, unknown>)
            }
            cursor="pointer"
          />
        ))}
        {annotations?.map((ann) => {
          const props = createAnnotation(ann.key, ann.x, ann.y, ann.label);
          return <ReferenceDot {...props} />;
        })}
      </BarChart>
    </ResponsiveContainer>
  );
}
