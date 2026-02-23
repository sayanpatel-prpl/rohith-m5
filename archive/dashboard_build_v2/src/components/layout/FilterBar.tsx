import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "../../stores/filter-store";
import { DEFAULT_FILTERS } from "../../types/filters";
import { COMPANIES } from "../../data/companies";

/** Sub-category options for filter dropdown */
const SUB_CATEGORY_OPTIONS = [
  { value: "all", label: "All Sub-categories" },
  { value: "AC", label: "AC" },
  { value: "Kitchen", label: "Kitchen" },
  { value: "Electrical", label: "Electrical" },
  { value: "EMS", label: "EMS" },
  { value: "Mixed", label: "Mixed" },
  { value: "Cooler", label: "Cooler" },
];

/** Performance tier options */
const PERFORMANCE_OPTIONS = [
  { value: "all", label: "All Tiers" },
  { value: "outperform", label: "Outperform" },
  { value: "inline", label: "Inline" },
  { value: "underperform", label: "Underperform" },
];

/** Time period options */
const TIME_PERIOD_OPTIONS = [
  { value: "YoY", label: "YoY" },
  { value: "QoQ", label: "QoQ" },
];

/**
 * Horizontal filter strip with 4 filter controls.
 * Reads/writes Zustand filter store via individual primitive selectors.
 */
export function FilterBar() {
  // Individual primitive selectors (Zustand v5 best practice)
  const companies = useFilterStore((s) => s.companies);
  const subCategory = useFilterStore((s) => s.subCategory);
  const performanceTier = useFilterStore((s) => s.performanceTier);
  const timePeriod = useFilterStore((s) => s.timePeriod);
  const setCompanies = useFilterStore((s) => s.setCompanies);
  const setSubCategory = useFilterStore((s) => s.setSubCategory);
  const setPerformanceTier = useFilterStore((s) => s.setPerformanceTier);
  const setTimePeriod = useFilterStore((s) => s.setTimePeriod);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  const hasActiveFilters =
    companies.length > 0 ||
    subCategory !== DEFAULT_FILTERS.subCategory ||
    performanceTier !== DEFAULT_FILTERS.performanceTier ||
    timePeriod !== DEFAULT_FILTERS.timePeriod;

  return (
    <div
      data-print-hide
      className="flex items-center gap-3 px-6 h-9 bg-surface-raised/50 shrink-0"
      style={{ borderBottom: "1px solid oklch(0.92 0.01 250)" }}
    >
      <span className="text-xs text-text-muted font-medium">Filters</span>

      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Company multi-select */}
        <CompanyMultiSelect
          selected={companies}
          onChange={setCompanies}
        />

        {/* Sub-category select */}
        <SelectControl
          label="Sub-category"
          value={subCategory}
          options={SUB_CATEGORY_OPTIONS}
          onChange={setSubCategory}
        />

        {/* Performance tier select */}
        <SelectControl
          label="Performance"
          value={performanceTier}
          options={PERFORMANCE_OPTIONS}
          onChange={setPerformanceTier}
        />

        {/* Time period select */}
        <SelectControl
          label="Period"
          value={timePeriod}
          options={TIME_PERIOD_OPTIONS}
          onChange={setTimePeriod}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer whitespace-nowrap"
        >
          Reset
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simple select dropdown (no Radix needed for single select)
// ---------------------------------------------------------------------------

interface SelectControlProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}

function SelectControl({ label, value, options, onChange }: SelectControlProps) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs text-text-muted whitespace-nowrap">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs px-2 py-1 bg-surface-raised border border-surface-overlay rounded
                   text-text-primary hover:bg-surface-overlay transition-colors cursor-pointer
                   outline-none focus:ring-1 focus:ring-brand-accent min-w-20"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Company multi-select dropdown with checkboxes
// ---------------------------------------------------------------------------

interface CompanyMultiSelectProps {
  selected: string[];
  onChange: (companies: string[]) => void;
}

function CompanyMultiSelect({ selected, onChange }: CompanyMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((c) => c !== id)
        : [...selected, id]
    );
  }

  // Build trigger label
  let triggerLabel: string;
  if (selected.length === 0) {
    triggerLabel = "All Companies";
  } else if (selected.length <= 2) {
    triggerLabel = selected
      .map((id) => COMPANIES.find((c) => c.id === id)?.name.split(" ")[0] ?? id)
      .join(", ");
  } else {
    triggerLabel = `${selected.length} companies`;
  }

  return (
    <div className="flex items-center gap-1 relative" ref={ref}>
      <span className="text-xs text-text-muted whitespace-nowrap">Companies</span>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-surface-raised
                   border border-surface-overlay rounded min-w-24 max-w-48
                   hover:bg-surface-overlay transition-colors cursor-pointer
                   outline-none focus:ring-1 focus:ring-brand-accent"
      >
        <span className="truncate">{triggerLabel}</span>
        <span className="text-text-muted text-[10px] shrink-0">{"\u25BE"}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-surface-raised border border-surface-overlay rounded shadow-lg w-56">
          <div className="max-h-60 overflow-y-auto p-1">
            {COMPANIES.map((company) => (
              <label
                key={company.id}
                className="flex items-center gap-2 px-2 py-1 text-xs cursor-pointer hover:bg-surface-overlay rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(company.id)}
                  onChange={() => toggle(company.id)}
                  className="h-3.5 w-3.5 shrink-0 rounded-sm accent-brand-accent cursor-pointer"
                />
                <span className="text-text-primary truncate">{company.name}</span>
              </label>
            ))}
          </div>

          {selected.length > 0 && (
            <div className="border-t border-surface-overlay p-1">
              <button
                onClick={() => onChange([])}
                className="text-xs text-text-muted hover:text-text-primary w-full text-left px-2 py-1 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
