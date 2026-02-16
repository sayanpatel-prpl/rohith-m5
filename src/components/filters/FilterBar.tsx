import { useFilterStore } from "../../stores/filter-store";
import { DEFAULT_FILTERS } from "../../types/filters";
import { CompanyPicker } from "./CompanyPicker";
import { SelectFilter } from "./SelectFilter";
import {
  COMPANY_OPTIONS,
  SUB_CATEGORY_OPTIONS,
  PERFORMANCE_OPTIONS,
  TIME_PERIOD_OPTIONS,
} from "./filter-options";

/**
 * Horizontal filter strip rendered between TopBar and content area.
 * Always visible (not collapsible). Compact single row with 4 filter controls.
 *
 * Reads filter state and actions from Zustand filter store via individual
 * primitive selectors (prevents Zustand v5 infinite re-render loops).
 */
export function FilterBar() {
  // Individual primitive selectors (Zustand v5 best practice)
  const subCategory = useFilterStore((s) => s.subCategory);
  const performanceTier = useFilterStore((s) => s.performanceTier);
  const timePeriod = useFilterStore((s) => s.timePeriod);
  const companies = useFilterStore((s) => s.companies);
  const setSubCategory = useFilterStore((s) => s.setSubCategory);
  const setPerformanceTier = useFilterStore((s) => s.setPerformanceTier);
  const setTimePeriod = useFilterStore((s) => s.setTimePeriod);
  const resetFilters = useFilterStore((s) => s.resetFilters);

  // Show Reset button only when filters differ from defaults
  const hasActiveFilters =
    companies.length > 0 ||
    subCategory !== DEFAULT_FILTERS.subCategory ||
    performanceTier !== DEFAULT_FILTERS.performanceTier ||
    timePeriod !== DEFAULT_FILTERS.timePeriod;

  return (
    <div data-print-hide className="flex items-center gap-md px-md h-9 bg-surface border-b border-surface-overlay shrink-0">
      <span className="text-xs text-text-muted font-medium">Filters</span>

      <div className="flex items-center gap-md flex-1 min-w-0">
        <CompanyPicker options={COMPANY_OPTIONS} />

        <SelectFilter
          label="Sub-category"
          value={subCategory}
          options={SUB_CATEGORY_OPTIONS}
          onChange={setSubCategory}
        />

        <SelectFilter
          label="Performance"
          value={performanceTier}
          options={PERFORMANCE_OPTIONS}
          onChange={setPerformanceTier}
        />

        <SelectFilter
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
