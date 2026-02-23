import { lazy } from "react";
import type { SectionId } from "../../types/common";

/**
 * Lazy-loaded section component map.
 * Each section is a separate chunk that loads only on first visit.
 * React.lazy requires default exports (each section uses `export default function`).
 */
export const lazySections: Record<
  SectionId,
  React.LazyExoticComponent<React.ComponentType>
> = {
  executive: lazy(
    () => import("../../sections/executive/ExecutiveSnapshot")
  ),
  "market-pulse": lazy(
    () => import("../../sections/market-pulse/MarketPulse")
  ),
  financial: lazy(
    () => import("../../sections/financial/FinancialPerformance")
  ),
  deals: lazy(
    () => import("../../sections/deals/DealsTransactions")
  ),
  operations: lazy(
    () => import("../../sections/operations/OperationalIntelligence")
  ),
  leadership: lazy(
    () => import("../../sections/leadership/LeadershipGovernance")
  ),
  competitive: lazy(
    () => import("../../sections/competitive/CompetitiveMoves")
  ),
  "deep-dive": lazy(
    () => import("../../sections/deep-dive/SubSectorDeepDive")
  ),
  "action-lens": lazy(
    () => import("../../sections/action-lens/ActionLens")
  ),
  watchlist: lazy(
    () => import("../../sections/watchlist/Watchlist")
  ),
};
