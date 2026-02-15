import type { TooltipProps } from "recharts";

/**
 * Custom Recharts tooltip with Bloomberg-style dark overlay aesthetic.
 * Uses brand CSS custom properties for colors.
 */
export function ChartTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div
      className="bg-surface-overlay border border-surface-overlay rounded shadow-lg px-md py-sm"
      style={{ minWidth: 120 }}
    >
      {label != null && (
        <p className="text-text-secondary text-xs mb-xs font-medium">{label}</p>
      )}
      {payload.map((entry) => (
        <div
          key={entry.dataKey ?? entry.name}
          className="flex items-center justify-between gap-md text-xs"
        >
          <span className="text-text-secondary">{entry.name ?? entry.dataKey}</span>
          <span
            className="text-text-primary font-semibold"
            style={{ color: entry.color }}
          >
            {typeof entry.value === "number"
              ? entry.value.toLocaleString("en-IN")
              : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}
