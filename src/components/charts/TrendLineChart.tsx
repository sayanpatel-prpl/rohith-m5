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
  height = 240,
}: TrendLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
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
