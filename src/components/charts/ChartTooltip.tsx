import type { TooltipProps } from "recharts";
import type { Payload } from "recharts/types/component/DefaultTooltipContent";

/**
 * Custom Recharts tooltip with Bloomberg-style dark overlay aesthetic.
 * Uses brand CSS custom properties for colors.
 */
export function ChartTooltip(props: TooltipProps<number, string>) {
  const { active, payload, label } = props as {
    active?: boolean;
    payload?: Payload<number, string>[];
    label?: string | number;
  };

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
      {payload.map((entry: Payload<number, string>) => (
        <div
          key={String(entry.dataKey ?? entry.name)}
          className="flex items-center justify-between gap-md text-xs"
        >
          <span className="text-text-secondary">{entry.name ?? String(entry.dataKey)}</span>
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
