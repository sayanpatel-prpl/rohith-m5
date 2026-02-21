/**
 * Leadership & Governance section data adapter.
 *
 * Builds LeadershipData by combining data from:
 * - consolidated: shareholding patterns (promoter, FII, DII by quarter)
 * - sovrenn: concall highlights with management commentary
 * - financial-api: performance tiers for context
 *
 * Derives governance risk scores from:
 * - Promoter holding decline >2% QoQ = amber
 * - Promoter holding decline >5% QoQ = red
 * - Significant FII exit (>3% QoQ decline) = amber
 * - Stable/rising promoter holding = green
 *
 * Maps governance patterns to A&M service lines:
 * - Declining promoter + stress = Restructuring (turnaround)
 * - Rising institutional = Transaction Advisory (PE advisory)
 * - Stable governance = CPI (growth advisory)
 *
 * Never fabricates data. Missing values produce null/empty arrays.
 */

import { getConsolidatedData } from "../loaders/consolidated";
import type { ConsolidatedCompany, ShareholdingEntry } from "../loaders/consolidated";
import { getSovrennData } from "../loaders/sovrenn";
import type { SovrennCompany } from "../loaders/sovrenn";
import { getFinancialApiData } from "../loaders/financial-api";
import type { FinancialApiCompany } from "../loaders/financial-api";
import { getCompanyById } from "../companies";

import type {
  LeadershipData,
  GovernanceRiskScore,
  GovernanceRiskLevel,
  PromoterHoldingEntry,
  ShareholdingSnapshot,
  LeadershipEvent,
  LeadershipEventType,
  LeadershipSummaryStats,
} from "../../types/leadership";
import type { AMServiceLine } from "../../types/am-theme";
import { screenerSource as _screenerSource, sovrennSource as _sovrennSource, derivedSource as _derivedSource } from "./source-helpers";

// Leadership-specific source labels
const screenerSource = (lastUpdated: string) => _screenerSource(lastUpdated, "Screener.in shareholding data");
const sovrennSource = (lastUpdated: string) => _sovrennSource(lastUpdated, "Sovrenn Intelligence concall analysis");
const derivedSource = (lastUpdated: string) => _derivedSource(lastUpdated, "Cross-source governance analysis");

// ---------------------------------------------------------------------------
// Company data bundle (local to this adapter)
// ---------------------------------------------------------------------------

interface LeadershipBundle {
  id: string;
  name: string;
  consolidated: ConsolidatedCompany | undefined;
  sovrenn: SovrennCompany | undefined;
  financial: FinancialApiCompany | undefined;
}

function buildBundles(): LeadershipBundle[] {
  const consolidated = getConsolidatedData();
  const sovrenn = getSovrennData();
  const financial = getFinancialApiData();

  const idSet = new Set<string>();
  consolidated.companies.forEach((c) => idSet.add(c.id.toLowerCase()));
  sovrenn.forEach((c) => idSet.add(c.companyId.toLowerCase()));

  return Array.from(idSet).map((id) => ({
    id,
    name:
      getCompanyById(id)?.name ??
      consolidated.companies.find((c) => c.id.toLowerCase() === id)?.name ??
      id,
    consolidated: consolidated.companies.find(
      (c) => c.id.toLowerCase() === id,
    ),
    sovrenn: sovrenn.find((c) => c.companyId.toLowerCase() === id),
    financial: financial.companies.find((c) => c.id.toLowerCase() === id),
  }));
}

// ---------------------------------------------------------------------------
// Shareholding extraction
// ---------------------------------------------------------------------------

function extractShareholding(
  entries: ShareholdingEntry[],
): ShareholdingSnapshot[] {
  return entries.map((e) => ({
    period: e.period,
    promoterPct: e.Promoters ?? 0,
    fiiPct: e.FIIs ?? 0,
    diiPct: e.DIIs ?? 0,
    publicPct: e.Public ?? 0,
  }));
}

// ---------------------------------------------------------------------------
// Governance Risk Scoring (LEAD-02)
// ---------------------------------------------------------------------------

function computeGovernanceRisk(
  bundle: LeadershipBundle,
  lastUpdated: string,
): GovernanceRiskScore | null {
  const sh = bundle.consolidated?.shareholding;
  if (!sh || sh.length < 2) return null;

  const latest = sh[sh.length - 1];
  const prev = sh[sh.length - 2];

  const promoterLatest = latest.Promoters;
  const promoterPrev = prev.Promoters;

  // Handle undefined promoter (e.g., Crompton)
  if (promoterLatest == null || promoterPrev == null) {
    return {
      companyId: bundle.id,
      company: bundle.name,
      score: "amber",
      factors: ["Promoter holding data unavailable -- governance visibility limited"],
      amServiceLine: "CPI",
      source: screenerSource(lastUpdated),
    };
  }

  const promoterChange = promoterLatest - promoterPrev;
  const fiiLatest = latest.FIIs ?? 0;
  const fiiPrev = prev.FIIs ?? 0;
  const fiiChange = fiiLatest - fiiPrev;
  const diiLatest = latest.DIIs ?? 0;
  const diiPrev = prev.DIIs ?? 0;
  const diiChange = diiLatest - diiPrev;

  const factors: string[] = [];
  let score: GovernanceRiskLevel = "green";
  let amServiceLine: AMServiceLine = "CPI";

  // RED triggers: severe promoter decline or very low promoter holding
  if (promoterChange < -5) {
    score = "red";
    factors.push(
      `Promoter holding declined ${Math.abs(promoterChange).toFixed(1)}pp QoQ (${prev.period} to ${latest.period})`,
    );
    amServiceLine = "Restructuring";
  } else if (promoterLatest < 30 && promoterChange < 0) {
    score = "red";
    factors.push(
      `Low promoter holding at ${promoterLatest.toFixed(1)}% with continued decline`,
    );
    amServiceLine = "Restructuring";
  }

  // AMBER triggers: moderate promoter decline or institutional shifts
  if (score === "green") {
    if (promoterChange < -2) {
      score = "amber";
      factors.push(
        `Promoter holding declined ${Math.abs(promoterChange).toFixed(1)}pp QoQ`,
      );
      amServiceLine = "CPI";
    } else if (fiiChange < -3) {
      score = "amber";
      factors.push(
        `FII holding declined ${Math.abs(fiiChange).toFixed(1)}pp QoQ -- institutional exit signal`,
      );
      amServiceLine = "Transaction Advisory";
    }
  }

  // Add contextual factors
  if (promoterLatest < 40 && score !== "red") {
    factors.push(
      `Relatively low promoter holding at ${promoterLatest.toFixed(1)}%`,
    );
  }

  if (diiChange > 3) {
    factors.push(
      `DII holding increased ${diiChange.toFixed(1)}pp -- domestic institutional confidence`,
    );
  }

  if (fiiChange > 2 && score === "green") {
    factors.push(
      `FII holding increased ${fiiChange.toFixed(1)}pp -- foreign institutional interest`,
    );
    amServiceLine = "Transaction Advisory";
  }

  // Green factors
  if (score === "green") {
    if (promoterChange === 0 && promoterLatest > 50) {
      factors.push(`Stable promoter holding at ${promoterLatest.toFixed(1)}% -- strong governance`);
      amServiceLine = "CPI";
    } else if (promoterChange === 0) {
      factors.push(`Stable promoter holding at ${promoterLatest.toFixed(1)}%`);
    } else if (promoterChange > 0) {
      factors.push(
        `Promoter holding increased ${promoterChange.toFixed(1)}pp -- alignment signal`,
      );
    }
  }

  // Ensure at least one factor
  if (factors.length === 0) {
    factors.push(`Promoter at ${promoterLatest.toFixed(1)}%, no significant changes`);
  }

  return {
    companyId: bundle.id,
    company: bundle.name,
    score,
    factors,
    amServiceLine,
    source: screenerSource(lastUpdated),
  };
}

// ---------------------------------------------------------------------------
// Promoter Holdings (LEAD-03)
// ---------------------------------------------------------------------------

function buildPromoterHolding(
  bundle: LeadershipBundle,
  lastUpdated: string,
): PromoterHoldingEntry | null {
  const sh = bundle.consolidated?.shareholding;
  if (!sh || sh.length < 2) return null;

  const latest = sh[sh.length - 1];
  const prev = sh[sh.length - 2];

  const promoterLatest = latest.Promoters;
  const promoterPrev = prev.Promoters;

  if (promoterLatest == null) return null;

  const changeQoQ = promoterPrev != null ? promoterLatest - promoterPrev : 0;
  const history = extractShareholding(sh);

  // Derive A&M implication
  let amServiceLineImplication: string;
  let amServiceLine: AMServiceLine;

  if (changeQoQ < -5) {
    amServiceLineImplication =
      "Significant promoter exit -- turnaround/restructuring advisory opportunity";
    amServiceLine = "Restructuring";
  } else if (changeQoQ < -2) {
    amServiceLineImplication =
      "Moderate promoter decline -- performance improvement engagement";
    amServiceLine = "CPI";
  } else if (changeQoQ < 0) {
    amServiceLineImplication =
      "Minor promoter dilution -- monitor for sustained trend";
    amServiceLine = "CPI";
  } else {
    // Check for rising institutional holdings
    const fiiLatest = latest.FIIs ?? 0;
    const fiiPrev = prev.FIIs ?? 0;
    const diiLatest = latest.DIIs ?? 0;
    const diiPrev = prev.DIIs ?? 0;

    if (fiiLatest - fiiPrev > 2 || diiLatest - diiPrev > 3) {
      amServiceLineImplication =
        "Rising institutional interest -- PE advisory / transaction support opportunity";
      amServiceLine = "Transaction Advisory";
    } else {
      amServiceLineImplication =
        "Stable governance -- growth advisory / operational improvement engagement";
      amServiceLine = "Operations";
    }
  }

  return {
    companyId: bundle.id,
    company: bundle.name,
    latestPromoterPct: promoterLatest,
    changeQoQ,
    history,
    amServiceLineImplication,
    amServiceLine,
    source: screenerSource(lastUpdated),
  };
}

// ---------------------------------------------------------------------------
// Leadership Timeline (LEAD-01)
// ---------------------------------------------------------------------------

function buildTimeline(
  bundles: LeadershipBundle[],
  lastUpdated: string,
): LeadershipEvent[] {
  const events: LeadershipEvent[] = [];

  for (const b of bundles) {
    const sh = b.consolidated?.shareholding;
    if (!sh || sh.length < 2) continue;

    // Detect significant shareholding events across the history
    for (let i = 1; i < sh.length; i++) {
      const curr = sh[i];
      const prev = sh[i - 1];

      const promoterCurr = curr.Promoters;
      const promoterPrev = prev.Promoters;

      if (promoterCurr == null || promoterPrev == null) continue;

      const promoterChange = promoterCurr - promoterPrev;
      const fiiChange = (curr.FIIs ?? 0) - (prev.FIIs ?? 0);
      const diiChange = (curr.DIIs ?? 0) - (prev.DIIs ?? 0);

      // Significant promoter change (>2pp)
      if (Math.abs(promoterChange) > 2) {
        const direction = promoterChange > 0 ? "increased" : "declined";
        const eventType: LeadershipEventType = "promoter-change";
        events.push({
          companyId: b.id,
          company: b.name,
          date: curr.period,
          title: `Promoter holding ${direction} ${Math.abs(promoterChange).toFixed(1)}pp`,
          detail: `${b.name} promoter stake moved from ${promoterPrev.toFixed(1)}% to ${promoterCurr.toFixed(1)}% between ${prev.period} and ${curr.period}.`,
          type: eventType,
          source: screenerSource(lastUpdated),
        });
      }

      // Significant institutional shift (>3pp in FII or DII)
      if (Math.abs(fiiChange) > 3 || Math.abs(diiChange) > 3) {
        const shifts: string[] = [];
        if (Math.abs(fiiChange) > 3) {
          shifts.push(`FII ${fiiChange > 0 ? "+" : ""}${fiiChange.toFixed(1)}pp`);
        }
        if (Math.abs(diiChange) > 3) {
          shifts.push(`DII ${diiChange > 0 ? "+" : ""}${diiChange.toFixed(1)}pp`);
        }
        events.push({
          companyId: b.id,
          company: b.name,
          date: curr.period,
          title: `Institutional holding shift: ${shifts.join(", ")}`,
          detail: `${b.name} saw significant institutional rebalancing in ${curr.period}. ${shifts.join(". ")}.`,
          type: "institutional-shift" as LeadershipEventType,
          source: screenerSource(lastUpdated),
        });
      }
    }

    // Add management commentary from sovrenn concall highlights
    if (b.sovrenn?.concallHighlights) {
      for (const ch of b.sovrenn.concallHighlights) {
        // keyPoints is the typed field; actual JSON may use "points"
        const pts = ch.keyPoints ?? (ch as Record<string, unknown>)["points"] as string[] | undefined;
        if (!pts || pts.length === 0) continue;
        events.push({
          companyId: b.id,
          company: b.name,
          date: ch.date ?? ch.quarter,
          title: `Management commentary -- ${ch.quarter}`,
          detail: pts[0].substring(0, 300) + (pts[0].length > 300 ? "..." : ""),
          type: "management-commentary" as LeadershipEventType,
          source: sovrennSource(lastUpdated),
        });
      }
    }
  }

  // Sort by period (most recent first) -- period format is "Mon YYYY"
  const monthOrder: Record<string, number> = {
    Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
    Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
  };

  events.sort((a, b) => {
    const parseDate = (d: string) => {
      // Handle "Mon YYYY" format
      const parts = d.split(" ");
      if (parts.length >= 2) {
        const month = monthOrder[parts[0].substring(0, 3)] ?? 1;
        const year = parseInt(parts[parts.length - 1], 10) || 2025;
        return year * 100 + month;
      }
      return 0;
    };
    return parseDate(b.date) - parseDate(a.date);
  });

  return events;
}

// ---------------------------------------------------------------------------
// Summary Stats
// ---------------------------------------------------------------------------

function computeSummaryStats(
  riskScores: GovernanceRiskScore[],
  holdings: PromoterHoldingEntry[],
): LeadershipSummaryStats {
  const atRisk = riskScores.filter(
    (s) => s.score === "red" || s.score === "amber",
  ).length;

  const promoterValues = holdings
    .map((h) => h.latestPromoterPct)
    .filter((v) => v > 0);
  const avgPromoter =
    promoterValues.length > 0
      ? promoterValues.reduce((a, b) => a + b, 0) / promoterValues.length
      : 0;

  const declineCount = holdings.filter((h) => h.changeQoQ < 0).length;

  return {
    companiesTracked: riskScores.length,
    companiesAtRisk: atRisk,
    avgPromoterHolding: Math.round(avgPromoter * 10) / 10,
    promoterDeclineCount: declineCount,
  };
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Leadership & Governance section data payload */
export function buildLeadershipData(): LeadershipData {
  // ALTERNATIVE_DATA_SLOT: DGFT import/export data
  // Integration point: Patent filing trends as proxy for R&D governance effectiveness
  // Expected: getDGFTData() -> company-level import dependency ratios
  //
  // ALTERNATIVE_DATA_SLOT: PLI scheme data
  // Integration point: Patent filing trends as proxy for R&D governance effectiveness
  // Expected: getPLIData() -> company PLI eligibility and disbursement status
  //
  // ALTERNATIVE_DATA_SLOT: Google Trends data
  // Integration point: Patent filing trends as proxy for R&D governance effectiveness
  // Expected: getGoogleTrendsData() -> brand-level search interest indices
  //
  // ALTERNATIVE_DATA_SLOT: Patent filing data
  // Integration point: Patent filing trends as proxy for R&D governance effectiveness
  // Expected: getPatentData() -> company-level patent counts and categories

  const financialApi = getFinancialApiData();
  const lastUpdated = financialApi.lastUpdated ?? new Date().toISOString();

  const bundles = buildBundles();

  // Compute governance risk scores
  const governanceRiskScores = bundles
    .map((b) => computeGovernanceRisk(b, lastUpdated))
    .filter((s): s is GovernanceRiskScore => s !== null);

  // Sort: red first, then amber, then green
  const riskOrder: Record<string, number> = { red: 0, amber: 1, green: 2 };
  governanceRiskScores.sort(
    (a, b) => (riskOrder[a.score] ?? 2) - (riskOrder[b.score] ?? 2),
  );

  // Build promoter holdings
  const promoterHoldings = bundles
    .map((b) => buildPromoterHolding(b, lastUpdated))
    .filter((h): h is PromoterHoldingEntry => h !== null);

  // Sort by absolute QoQ change (largest moves first)
  promoterHoldings.sort(
    (a, b) => Math.abs(b.changeQoQ) - Math.abs(a.changeQoQ),
  );

  // Build timeline
  const leadershipTimeline = buildTimeline(bundles, lastUpdated);

  // Summary stats
  const summaryStats = computeSummaryStats(governanceRiskScores, promoterHoldings);

  return {
    section: "leadership",
    dataAsOf: financialApi.dataAsOf,
    lastUpdated,
    summaryStats,
    governanceRiskScores,
    promoterHoldings,
    leadershipTimeline,
  };
}
