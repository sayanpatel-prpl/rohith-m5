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
import { CHART_HEIGHT, CHART_MARGIN, GRID_PROPS, AXIS_TICK, AXIS_LINE } from "./chart-defaults";

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
  height = CHART_HEIGHT,
  stacked = false,
}: BarComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis
          dataKey={xDataKey}
          tick={AXIS_TICK}
          axisLine={AXIS_LINE}
          tickLine={false}
        />
        <YAxis
          tick={AXIS_TICK}
          axisLine={AXIS_LINE}
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
