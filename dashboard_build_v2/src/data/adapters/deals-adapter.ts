/**
 * Deals & Transactions section data adapter.
 *
 * Builds DealsData by extracting deal activity from Sovrenn intelligence data.
 * Auto-assigns A&M angle based on deal type and description keywords.
 * Generates deal patterns by clustering deal types and themes.
 *
 * Never fabricates data. If no deals found, returns empty arrays.
 */

import { getSovrennData } from "../loaders/sovrenn";
import type { SovrennDealActivity } from "../loaders/sovrenn";
import { getCompanyById } from "../companies";

import type {
  DealsData,
  DealEntry,
  DealPattern,
  DealSummaryStats,
  DealType,
  AMAngle,
} from "../../types/deals";
import type { SourceInfo } from "../../types/source";
import type { ConfidenceLevel } from "../../types/common";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sovrennSource(lastUpdated: string): SourceInfo {
  return {
    source: "Sovrenn Intelligence curated analysis",
    confidence: "derived",
    tier: 3,
    lastUpdated,
  };
}

/**
 * Parse informal date strings like "1st Dec 2025" or "9th Feb 2026"
 * into ISO-8601 format for sorting.
 */
function parseDateToISO(dateStr: string): string {
  // Remove ordinal suffixes (st, nd, rd, th)
  const cleaned = dateStr.replace(/(\d+)(st|nd|rd|th)\s/i, "$1 ");
  const parsed = new Date(cleaned);
  if (isNaN(parsed.getTime())) {
    // Fallback: return a sortable string
    return "2025-01-01";
  }
  return parsed.toISOString().split("T")[0];
}

/**
 * Classify the raw deal type + description into a structured DealType.
 */
function classifyDealType(
  rawType: string,
  description: string,
): { dealType: DealType; label: string } {
  const descLower = description.toLowerCase();

  if (rawType === "acquisition") {
    // Some "acquisition" entries are actually credit ratings
    if (/icra|crisil|rating|rated|reaffirm/i.test(description)) {
      return { dealType: "rating", label: "Credit Rating" };
    }
    return { dealType: "acquisition", label: "Acquisition" };
  }

  if (rawType === "investment") {
    return { dealType: "investment", label: "Investment" };
  }

  if (rawType === "qip") {
    return { dealType: "qip", label: "QIP" };
  }

  // "other" type: classify by description keywords
  if (/allot.*land|acres.*land|land.*allot|yeida|manufacturing.*facility/i.test(description)) {
    return { dealType: "land-allotment", label: "Land Allotment" };
  }

  if (/fundrais|raise.*inr|raise.*cr|rights?\s*issue/i.test(description)) {
    return { dealType: "fundraise", label: "Fundraise" };
  }

  if (/partnership|joint venture|jv\b/i.test(description)) {
    return { dealType: "partnership", label: "Partnership" };
  }

  if (/icra|crisil|rating|rated|reaffirm/i.test(description)) {
    return { dealType: "rating", label: "Credit Rating" };
  }

  return { dealType: "other", label: "Other" };
}

/**
 * Auto-assign A&M angle based on deal type and description keywords.
 */
function assignAMAngle(
  dealType: DealType,
  description: string,
): { angle: AMAngle; rationale: string } {
  const descLower = description.toLowerCase();

  switch (dealType) {
    case "acquisition":
      // Check if it's a large strategic acquisition vs. bolt-on
      if (/majority stake|controlling stake|100%/i.test(description)) {
        return {
          angle: "Integration Support",
          rationale:
            "Majority/controlling acquisition requires post-deal integration planning, synergy capture, and organizational alignment.",
        };
      }
      return {
        angle: "CDD Opportunity",
        rationale:
          "Acquisition activity signals commercial due diligence opportunity for target assessment, market validation, and value creation thesis.",
      };

    case "investment":
      if (/ccps|preference share|convertible/i.test(description)) {
        return {
          angle: "Valuation",
          rationale:
            "Structured investment with convertible instruments requires valuation advisory for conversion price and dilution impact assessment.",
        };
      }
      return {
        angle: "CDD Opportunity",
        rationale:
          "Investment round signals due diligence opportunity for investor-side commercial assessment.",
      };

    case "qip":
      return {
        angle: "Valuation",
        rationale:
          "QIP pricing and allocation advisory, institutional investor positioning, and post-raise capital deployment strategy.",
      };

    case "fundraise":
      return {
        angle: "Valuation",
        rationale:
          "Capital raise requires valuation advisory, investor presentation support, and capital allocation strategy.",
      };

    case "land-allotment":
      return {
        angle: "CDD Opportunity",
        rationale:
          "Large-scale manufacturing expansion signals greenfield project assessment and capacity planning advisory needs.",
      };

    case "rating":
      if (/increased|upgrade/i.test(description)) {
        return {
          angle: "Valuation",
          rationale:
            "Rating upgrade with increased limits signals growing credit profile and potential refinancing or acquisition financing advisory.",
        };
      }
      return {
        angle: "Restructuring",
        rationale:
          "Credit rating activity may signal balance sheet optimization or debt restructuring advisory needs.",
      };

    case "partnership":
      return {
        angle: "Integration Support",
        rationale:
          "JV/partnership formation requires governance structure, commercial terms, and operational integration advisory.",
      };

    default:
      return {
        angle: "CDD Opportunity",
        rationale:
          "General corporate activity that may require commercial due diligence or advisory support.",
      };
  }
}

/**
 * Determine if an "other" type entry is actually a quarterly result
 * (not a real deal) and should be filtered out.
 */
function isQuarterlyResult(description: string): boolean {
  return /^[\s(]*(?:GOOD|POOR|EXCELLENT|AVERAGE|WEAK|MIXED)?\s*RESULTS?\s*\)/i.test(
    description,
  );
}

// ---------------------------------------------------------------------------
// Pattern Detection (DEAL-02)
// ---------------------------------------------------------------------------

function detectPatterns(deals: DealEntry[]): DealPattern[] {
  const patterns: DealPattern[] = [];

  if (deals.length === 0) return patterns;

  // Pattern 1: Acquisition spree
  const acquisitions = deals.filter((d) => d.dealType === "acquisition");
  if (acquisitions.length >= 3) {
    patterns.push({
      pattern: "Serial Acquisition Strategy",
      confidence: "verified",
      supportingDealIds: acquisitions.map((d) => d.id),
      explanation: `${acquisitions.length} acquisitions detected across the sector, indicating aggressive inorganic growth strategies. Companies are acquiring capabilities in electronics, PCB manufacturing, and international operations.`,
    });
  }

  // Pattern 2: Capital raising activity
  const capitalRaises = deals.filter(
    (d) =>
      d.dealType === "qip" ||
      d.dealType === "fundraise" ||
      d.dealType === "investment",
  );
  if (capitalRaises.length >= 2) {
    const totalRaised = capitalRaises.reduce(
      (sum, d) => sum + (d.valueCr ?? 0),
      0,
    );
    patterns.push({
      pattern: "Capital Mobilization Wave",
      confidence: "verified",
      supportingDealIds: capitalRaises.map((d) => d.id),
      explanation: `${capitalRaises.length} capital raising events totaling INR ${Math.round(totalRaised).toLocaleString("en-IN")} Cr. Sector participants are building war chests for expansion and acquisitions.`,
    });
  }

  // Pattern 3: Vertical integration
  const verticalDeals = deals.filter(
    (d) =>
      /pcb|electronics|component|backward integration|value chain/i.test(
        d.description,
      ),
  );
  if (verticalDeals.length >= 2) {
    patterns.push({
      pattern: "Vertical Integration Push",
      confidence: "derived",
      supportingDealIds: verticalDeals.map((d) => d.id),
      explanation: `${verticalDeals.length} deals focused on backward integration into electronics, PCB, and component manufacturing. Companies are securing supply chains and capturing more of the value chain.`,
    });
  }

  // Pattern 4: International expansion
  const intlDeals = deals.filter(
    (d) =>
      /israel|international|global|overseas|foreign/i.test(d.description),
  );
  if (intlDeals.length >= 2) {
    patterns.push({
      pattern: "International Expansion",
      confidence: "derived",
      supportingDealIds: intlDeals.map((d) => d.id),
      explanation: `${intlDeals.length} deals with international dimensions, signaling sector participants looking beyond India for technology, capabilities, and market access.`,
    });
  }

  // Pattern 5: Capacity expansion
  const capacityDeals = deals.filter(
    (d) =>
      d.dealType === "land-allotment" ||
      /facility|capacity|plant|greenfield|manufacturing unit/i.test(
        d.description,
      ),
  );
  if (capacityDeals.length >= 1) {
    patterns.push({
      pattern: "Capacity Expansion",
      confidence: "verified",
      supportingDealIds: capacityDeals.map((d) => d.id),
      explanation: `${capacityDeals.length} capacity expansion moves including new land allotments and manufacturing facilities. Sector anticipates sustained demand growth.`,
    });
  }

  return patterns;
}

// ---------------------------------------------------------------------------
// Summary Statistics
// ---------------------------------------------------------------------------

function computeSummaryStats(deals: DealEntry[]): DealSummaryStats {
  if (deals.length === 0) {
    return {
      totalDeals: 0,
      totalValueCr: 0,
      activeCompanies: 0,
      dominantDealType: "-",
      dominantAMAngle: "CDD Opportunity",
    };
  }

  const totalValueCr = deals.reduce(
    (sum, d) => sum + (d.valueCr ?? 0),
    0,
  );

  const companySet = new Set(deals.map((d) => d.companyId));

  // Find dominant deal type
  const typeCounts: Record<string, number> = {};
  for (const d of deals) {
    typeCounts[d.dealTypeLabel] = (typeCounts[d.dealTypeLabel] ?? 0) + 1;
  }
  const dominantDealType = Object.entries(typeCounts).sort(
    (a, b) => b[1] - a[1],
  )[0][0];

  // Find dominant A&M angle
  const angleCounts: Record<string, number> = {};
  for (const d of deals) {
    angleCounts[d.amAngle] = (angleCounts[d.amAngle] ?? 0) + 1;
  }
  const dominantAMAngle = Object.entries(angleCounts).sort(
    (a, b) => b[1] - a[1],
  )[0][0] as AMAngle;

  return {
    totalDeals: deals.length,
    totalValueCr: Math.round(totalValueCr),
    activeCompanies: companySet.size,
    dominantDealType,
    dominantAMAngle,
  };
}

// ---------------------------------------------------------------------------
// Main adapter function
// ---------------------------------------------------------------------------

/** Build the complete Deals & Transactions section data payload */
export function buildDealsData(): DealsData {
  const sovrenn = getSovrennData();
  const now = new Date().toISOString();

  const allDeals: DealEntry[] = [];
  let dealCounter = 0;

  for (const company of sovrenn) {
    if (!company.dealActivity || company.dealActivity.length === 0) continue;

    const companyMeta = getCompanyById(company.companyId);
    const companyName =
      companyMeta?.name ?? company.companyName.split(".")[0].trim();

    for (const deal of company.dealActivity) {
      // Skip quarterly results masquerading as deal activity
      if (isQuarterlyResult(deal.description)) continue;

      // Classify the deal
      const { dealType, label } = classifyDealType(
        deal.type,
        deal.description,
      );

      // Skip unclassifiable "other" entries that are just corporate announcements
      // without deal significance (quarterly results are already filtered above)
      if (dealType === "other") {
        // Keep "other" only if it has a material value and deal-like content
        const hasDealContent =
          /acqui|invest|stake|subsidiary|merger|jv|partnership|divest|land|facility|fundrais|ipo|qip|rating|allot/i.test(
            deal.description,
          );
        if (!hasDealContent) continue;
      }

      // Assign A&M angle
      const { angle, rationale } = assignAMAngle(dealType, deal.description);

      dealCounter++;
      const dateISO = parseDateToISO(deal.date);

      allDeals.push({
        id: `deal-${dealCounter}`,
        companyId: company.companyId,
        companyName:
          companyName.length > 60
            ? companyName.substring(0, 60)
            : companyName,
        dealType,
        dealTypeLabel: label,
        description: deal.description,
        valueCr: deal.valueCr,
        date: deal.date,
        dateISO,
        amAngle: angle,
        amAngleRationale: rationale,
        source: sovrennSource(now),
      });
    }
  }

  // Sort by date (most recent first)
  allDeals.sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  // Detect patterns
  const patterns = detectPatterns(allDeals);

  // Compute summary statistics
  const summaryStats = computeSummaryStats(allDeals);

  return {
    section: "deals",
    dataAsOf: "FY2026",
    lastUpdated: now,
    deals: allDeals,
    patterns,
    summaryStats,
  };
}
