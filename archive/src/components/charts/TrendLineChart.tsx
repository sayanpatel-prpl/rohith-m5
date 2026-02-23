import {
  LineChart,
  Line,
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

interface LineConfig {
  dataKey: string;
  /** CSS custom property name, e.g. "--color-chart-1" */
  colorVar: string;
  label: string;
}

interface TrendLineChartProps {
  data: Array<Record<string, unknown>>;
  lines: LineConfig[];
  xDataKey: string;
  annotations?: ChartAnnotation[];
  onPointClick?: (dataKey: string, payload: Record<string, unknown>) => void;
  height?: number;
}

export function TrendLineChart({
  data,
  lines,
  xDataKey,
  annotations,
  onPointClick,
  height = CHART_HEIGHT,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={CHART_MARGIN}>
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
        {lines.map((line) => (
          <Line
            key={line.dataKey}
            type="monotone"
            dataKey={line.dataKey}
            name={line.label}
            stroke={`var(${line.colorVar})`}
            strokeWidth={2}
            dot={{ r: 3, fill: `var(${line.colorVar})` }}
            activeDot={{
              r: 5,
              onClick: (
                _e: unknown,
                payload: unknown,
              ) =>
                onPointClick?.(
                  line.dataKey,
                  payload as Record<string, unknown>,
                ),
            }}
          />
        ))}
        {annotations?.map((ann) => {
          const props = createAnnotation(ann.key, ann.x, ann.y, ann.label);
          return <ReferenceDot {...props} />;
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}
