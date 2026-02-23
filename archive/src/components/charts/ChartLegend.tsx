interface LegendPayload {
  value: string;
  color?: string;
}

interface ChartLegendProps {
  payload?: LegendPayload[];
}

/**
 * Custom Recharts legend matching the design system.
 * Use `as any` cast when passing to Recharts `<Legend content={...}>`
 * to work around known Recharts v3 Legend typing issues (GitHub issue #2909).
 */
export function ChartLegend({ payload }: ChartLegendProps) {
  if (!payload || payload.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-md justify-center mt-sm">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-xs">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-text-secondary">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
