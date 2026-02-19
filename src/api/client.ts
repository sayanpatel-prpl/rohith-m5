import type { SectionData } from "../types/sections";
import type { SectionId } from "../types/common";

/**
 * API configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const USE_REAL_API = import.meta.env.VITE_USE_REAL_API !== "false"; // Default to true

/**
 * Map of section ID to dynamic import loader (fallback for mock data).
 */
const mockModules: Record<SectionId, () => Promise<SectionData>> = {
  executive: () => import("../data/mock/executive").then((m) => m.default),
  financial: () => import("../data/mock/financial").then((m) => m.default),
  "market-pulse": () =>
    import("../data/mock/market-pulse").then((m) => m.default),
  deals: () => import("../data/mock/deals").then((m) => m.default),
  operations: () => import("../data/mock/operations").then((m) => m.default),
  leadership: () => import("../data/mock/leadership").then((m) => m.default),
  competitive: () => import("../data/mock/competitive").then((m) => m.default),
  "deep-dive": () => import("../data/mock/deep-dive").then((m) => m.default),
  "action-lens": () =>
    import("../data/mock/action-lens").then((m) => m.default),
  watchlist: () => import("../data/mock/watchlist").then((m) => m.default),
};

/**
 * Fetch section data from real API or fall back to mock data
 */
export async function fetchSectionData<T extends SectionData>(
  sectionId: SectionId
): Promise<T> {
  // Use real API if enabled
  if (USE_REAL_API) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/${sectionId}`);

      if (!response.ok) {
        console.warn(
          `API returned ${response.status} for ${sectionId}, falling back to mock data`
        );
        return fetchMockData(sectionId) as Promise<T>;
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.warn(
        `Failed to fetch ${sectionId} from API, falling back to mock data:`,
        error
      );
      return fetchMockData(sectionId) as Promise<T>;
    }
  }

  // Use mock data
  return fetchMockData(sectionId) as Promise<T>;
}

/**
 * Fetch mock data (fallback)
 */
async function fetchMockData(sectionId: SectionId): Promise<SectionData> {
  // Simulate network latency in development
  if (import.meta.env.DEV) {
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );
  }

  const loader = mockModules[sectionId];
  if (!loader) throw new Error(`Unknown section: ${sectionId}`);

  return loader();
}
