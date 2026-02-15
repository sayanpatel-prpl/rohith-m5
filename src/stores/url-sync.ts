import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { useFilterStore } from "./filter-store";
import { DEFAULT_FILTERS, type FilterState } from "../types/filters";

/**
 * URL parameter key mapping.
 * Short keys keep URLs compact for sharing.
 */
const PARAM_MAP = {
  companies: "companies",
  subCategory: "subcat",
  performanceTier: "tier",
  timePeriod: "period",
} as const;

/** Convert filter state to URL search params, omitting default values */
function filtersToParams(filters: FilterState): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.companies.length > 0)
    params.set(PARAM_MAP.companies, filters.companies.join(","));
  if (filters.subCategory !== "all")
    params.set(PARAM_MAP.subCategory, filters.subCategory);
  if (filters.performanceTier !== "all")
    params.set(PARAM_MAP.performanceTier, filters.performanceTier);
  if (filters.timePeriod !== "YoY")
    params.set(PARAM_MAP.timePeriod, filters.timePeriod);
  return params;
}

/** Parse URL search params into partial filter state */
function paramsToFilters(params: URLSearchParams): Partial<FilterState> {
  const filters: Partial<FilterState> = {};

  const companies = params.get(PARAM_MAP.companies);
  if (companies) filters.companies = companies.split(",").filter(Boolean);

  const subcat = params.get(PARAM_MAP.subCategory);
  if (subcat) filters.subCategory = subcat;

  const tier = params.get(PARAM_MAP.performanceTier);
  if (tier) filters.performanceTier = tier;

  const period = params.get(PARAM_MAP.timePeriod);
  if (period) filters.timePeriod = period;

  return filters;
}

/**
 * Bidirectional sync between Zustand filter store and URL search params.
 * Call once at the report shell level (e.g., in AppShell).
 *
 * Uses ref-based guards to prevent infinite loops:
 * - URL change -> update store (skip if store-initiated)
 * - Store change -> update URL (skip if URL-initiated)
 */
export function useFilterUrlSync() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isUpdatingFromUrl = useRef(false);
  const isUpdatingFromStore = useRef(false);

  // URL -> Store (on mount and browser back/forward)
  useEffect(() => {
    if (isUpdatingFromStore.current) return;
    isUpdatingFromUrl.current = true;

    const filtersFromUrl = paramsToFilters(searchParams);
    // Merge with defaults so missing params reset to defaults
    useFilterStore.setState({ ...DEFAULT_FILTERS, ...filtersFromUrl });

    isUpdatingFromUrl.current = false;
  }, [searchParams]);

  // Store -> URL (on filter changes via subscribeWithSelector)
  useEffect(() => {
    const unsub = useFilterStore.subscribe(
      (state) => ({
        companies: state.companies,
        subCategory: state.subCategory,
        performanceTier: state.performanceTier,
        timePeriod: state.timePeriod,
      }),
      (filters) => {
        if (isUpdatingFromUrl.current) return;
        isUpdatingFromStore.current = true;
        setSearchParams(filtersToParams(filters as FilterState), {
          replace: true,
        });
        isUpdatingFromStore.current = false;
      },
      { equalityFn: (a, b) => JSON.stringify(a) === JSON.stringify(b) }
    );
    return unsub;
  }, [setSearchParams]);
}
