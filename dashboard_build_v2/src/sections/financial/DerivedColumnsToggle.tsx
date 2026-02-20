/**
 * FINP-05: Derived Intelligence Columns Toggle
 *
 * Renders a toggle button to show/hide derived competitive intelligence
 * columns (Market Share %, Pricing Power, Competitive Intensity).
 * When visible, shows an info bar listing column names with methodology tooltips.
 */

import { clsx } from "clsx";
import type { DerivedColumn } from "@/types/financial";

interface DerivedColumnsToggleProps {
  /** Available derived columns with methodology descriptions */
  columns: DerivedColumn[];
  /** Whether derived columns are currently visible */
  visible: boolean;
  /** Callback to toggle visibility */
  onToggle: () => void;
}

export function DerivedColumnsToggle({
  columns,
  visible,
  onToggle,
}: DerivedColumnsToggleProps) {
  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onToggle}
        className={clsx(
          "text-xs font-medium px-3 py-1.5 rounded border transition-colors",
          visible
            ? "border-brand-accent text-brand-accent bg-brand-accent/5"
            : "border-surface-overlay text-text-secondary hover:text-text-primary hover:border-text-muted",
        )}
      >
        {visible ? "Hide Market Intelligence" : "Show Market Intelligence"}
      </button>

      {visible && columns.length > 0 && (
        <div className="flex items-center gap-2 text-[10px] text-text-muted mt-0.5">
          {columns.map((col) => (
            <span
              key={col.id}
              className="px-1.5 py-0.5 rounded bg-surface-overlay cursor-help"
              title={col.methodology}
            >
              {col.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
