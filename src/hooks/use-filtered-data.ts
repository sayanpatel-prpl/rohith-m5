import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useFilterStore } from "../stores/filter-store";
import { sectionQueries } from "../api/queries";
import { getCompanyById } from "../data/mock/companies";
import type { SectionId } from "../types/common";
import type { SectionData } from "../types/sections";

/**
 * Generic hook combining TanStack Query cached data with Zustand filter state.
 *
 * Filtering happens in useMemo (synchronous derived data, no extra renders).
 * Filter state is NOT in queryKeys -- data is fetched once, filtered client-side (FOUND-14).
 *
 * Uses individual primitive selectors to prevent Zustand v5 infinite re-renders.
 */
export function useFilteredData<T extends SectionData>(sectionId: SectionId) {
  const queryFactory = sectionQueries[sectionId];
  const { data, isPending, error } = useQuery(queryFactory());

  // Individual primitive selectors prevent Zustand v5 re-render loops
  const companies = useFilterStore((s) => s.companies);
  const subCategory = useFilterStore((s) => s.subCategory);
  const performanceTier = useFilterStore((s) => s.performanceTier);
  const timePeriod = useFilterStore((s) => s.timePeriod);

  const filteredData = useMemo(() => {
    if (!data) return undefined;

    // Clone the top-level object to avoid mutating cache
    const result = { ...data } as Record<string, unknown>;

    // Walk each field -- if it's an array, apply filters to its entries
    for (const [key, value] of Object.entries(result)) {
      if (!Array.isArray(value)) continue;

      let filtered = value as Record<string, unknown>[];

      // Company filter: match entries with company/id field
      if (companies.length > 0) {
        filtered = filtered.filter((entry) => {
          const companyId =
            typeof entry.id === "string"
              ? entry.id
              : typeof entry.company === "string"
                ? entry.company
                : null;
          if (!companyId) return true; // Keep entries without company reference
          return companies.some(
            (c) =>
              c === companyId ||
              c ===
                String(entry.company)
                  .toLowerCase()
                  .replace(/\s+/g, "-")
          );
        });
      }

      // Sub-category filter: match company's subSector
      if (subCategory !== "all") {
        filtered = filtered.filter((entry) => {
          const companyId =
            typeof entry.id === "string"
              ? entry.id
              : typeof entry.company === "string"
                ? entry.company
                : null;
          if (!companyId) return true; // Keep entries without company reference
          const company = getCompanyById(companyId);
          if (!company) return true; // Keep entries for unknown companies
          return company.subSector === subCategory;
        });
      }

      // Performance tier filter: match entries with performance field
      if (performanceTier !== "all") {
        filtered = filtered.filter((entry) => {
          if (typeof entry.performance !== "string") return true;
          return entry.performance === performanceTier;
        });
      }

      result[key] = filtered;
    }

    return result as T;
  }, [data, companies, subCategory, performanceTier]);

  return {
    /** Filtered section data (undefined while loading) */
    data: filteredData,
    /** Original unfiltered data from cache */
    rawData: data as T | undefined,
    /** Whether the query is still loading */
    isPending,
    /** Query error, if any */
    error,
    /** Current filter state for display purposes */
    filters: { companies, subCategory, performanceTier, timePeriod },
  };
}
