import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  type FilterState,
  type FilterActions,
  DEFAULT_FILTERS,
} from "../types/filters";

/**
 * Global filter store managing 4 filter dimensions.
 * Uses subscribeWithSelector middleware for selective subscriptions
 * (used by URL sync hook for efficient bidirectional sync).
 *
 * Zustand v5 TypeScript pattern: create<T>()(middleware(fn))
 */
export const useFilterStore = create<FilterState & FilterActions>()(
  subscribeWithSelector((set) => ({
    ...DEFAULT_FILTERS,

    setCompanies: (companies) => set({ companies }),
    setSubCategory: (subCategory) => set({ subCategory }),
    setPerformanceTier: (tier) => set({ performanceTier: tier }),
    setTimePeriod: (period) => set({ timePeriod: period }),
    resetFilters: () => set(DEFAULT_FILTERS),
  }))
);
