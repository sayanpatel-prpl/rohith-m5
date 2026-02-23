/**
 * Lazy-loaded section registry.
 *
 * Maps all 11 SectionId values to React.lazy() dynamic imports.
 * Used by App.tsx routing to code-split each section into its own chunk.
 *
 * Order matches the navigation order defined in SectionId type.
 */

import { lazy } from "react";
import type { SectionId } from "../types/common";

export const lazySections: Record<SectionId, ReturnType<typeof lazy>> = {
  executive: lazy(() => import("./executive")),
  "am-value-add": lazy(() => import("./am-value-add")),
  "market-pulse": lazy(() => import("./market-pulse")),
  financial: lazy(() => import("./financial")),
  deals: lazy(() => import("./deals")),
  operations: lazy(() => import("./operations")),
  leadership: lazy(() => import("./leadership")),
  competitive: lazy(() => import("./competitive")),
  "deep-dive": lazy(() => import("./deep-dive")),
  "what-this-means": lazy(() => import("./what-this-means")),
  watchlist: lazy(() => import("./watchlist")),
};

export default lazySections;
