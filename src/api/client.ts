import type { SectionData } from "../types/sections";
import type { SectionId } from "../types/common";

/**
 * Map of section ID to dynamic import loader.
 * Each loader returns the default export from the corresponding mock fixture.
 * When real API is ready, replace with: fetch(`/api/sections/${sectionId}`).then(r => r.json())
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
 * Fetch section data. Currently reads from static JSON fixtures.
 * When real API is ready, replace with: fetch(`/api/sections/${sectionId}`).then(r => r.json())
 */
export async function fetchSectionData<T extends SectionData>(
  sectionId: SectionId
): Promise<T> {
  // Simulate network latency in development
  if (import.meta.env.DEV) {
    await new Promise((resolve) =>
      setTimeout(resolve, 200 + Math.random() * 300)
    );
  }

  const loader = mockModules[sectionId];
  if (!loader) throw new Error(`Unknown section: ${sectionId}`);

  return loader() as Promise<T>;
}
