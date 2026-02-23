import type { SectionId } from "../../types/common";

// ---------------------------------------------------------------------------
// Generic CSV utilities
// ---------------------------------------------------------------------------

/** Escape a cell value for CSV: wrap in quotes if it contains comma, quote, or newline. */
function escapeCSV(value: unknown): string {
  const str = value == null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Convert an array of objects to a CSV string.
 * Headers are extracted from the first object unless `columns` is provided.
 */
export function arrayToCSV(
  data: Record<string, unknown>[],
  columns?: string[],
): string {
  if (data.length === 0) return "";
  const headers = columns ?? Object.keys(data[0]);
  const rows = data.map((row) => headers.map((h) => escapeCSV(row[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}

/**
 * Trigger a browser download of a CSV string as a file.
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Section-specific CSV export
// ---------------------------------------------------------------------------

/**
 * Export the active section's tabular data as CSV.
 * For sections without tabular data, shows an alert.
 */
export async function exportSectionAsCSV(sectionId: SectionId): Promise<void> {
  switch (sectionId) {
    case "financial": {
      const mod = await import("../../data/mock/financial");
      const companies = mod.default.companies.map((c) => ({
        name: c.name,
        ticker: c.ticker,
        revenueGrowthYoY: c.metrics.revenueGrowthYoY,
        ebitdaMargin: c.metrics.ebitdaMargin,
        workingCapitalDays: c.metrics.workingCapitalDays,
        roce: c.metrics.roce,
        debtEquity: c.metrics.debtEquity,
        performanceTier: c.performance,
      }));
      downloadCSV(
        arrayToCSV(companies),
        "financial-performance.csv",
      );
      break;
    }

    case "competitive": {
      const mod = await import("../../data/mock/competitive");
      const launches = mod.default.productLaunches.map((p) => ({
        company: p.company,
        product: p.product,
        category: p.category,
        date: p.date,
        positioningNote: p.positioningNote,
      }));
      const pricing = mod.default.pricingActions.map((p) => ({
        company: p.company,
        action: p.action,
        category: p.category,
        magnitudePct: p.magnitudePct ?? "",
        context: p.context,
      }));
      // Combine into a single download with section headers
      const csv =
        "--- Product Launches ---\n" +
        arrayToCSV(launches) +
        "\n\n--- Pricing Actions ---\n" +
        arrayToCSV(pricing);
      downloadCSV(csv, "competitive-moves.csv");
      break;
    }

    case "watchlist": {
      const mod = await import("../../data/mock/watchlist");
      const d = mod.default;
      const fundraise = d.fundraiseSignals.map((s) => ({
        type: "Fundraise",
        company: s.company,
        signal: s.signal,
        confidence: s.confidence,
        timeframeMonths: s.timeframeMonths,
      }));
      const margin = d.marginInflectionCandidates.map((m) => ({
        type: "Margin Inflection",
        company: m.company,
        currentMarginPct: m.currentMarginPct,
        projectedMarginPct: m.projectedMarginPct,
        catalyst: m.catalyst,
        confidence: m.confidence,
      }));
      const consolidation = d.consolidationTargets.map((c) => ({
        type: "Consolidation Target",
        company: c.company,
        rationale: c.rationale,
        likelyAcquirers: c.likelyAcquirers.join("; "),
        confidence: c.confidence,
      }));
      const stress = d.stressIndicators.map((s) => ({
        type: "Stress Indicator",
        company: s.company,
        indicator: s.indicator,
        severity: s.severity,
      }));
      // Separate sections in one CSV for clarity
      const csv =
        "--- Fundraise Signals ---\n" +
        arrayToCSV(fundraise as Record<string, unknown>[]) +
        "\n\n--- Margin Inflection Candidates ---\n" +
        arrayToCSV(margin as Record<string, unknown>[]) +
        "\n\n--- Consolidation Targets ---\n" +
        arrayToCSV(consolidation as Record<string, unknown>[]) +
        "\n\n--- Stress Indicators ---\n" +
        arrayToCSV(stress as Record<string, unknown>[]);
      downloadCSV(csv, "watchlist-signals.csv");
      break;
    }

    case "deals": {
      const mod = await import("../../data/mock/deals");
      const deals = mod.default.deals.map((d) => ({
        id: d.id,
        type: d.type,
        parties: d.parties.join("; "),
        valueCr: d.valueCr ?? "Undisclosed",
        rationale: d.rationale,
        date: d.date,
        source: d.source,
      }));
      downloadCSV(
        arrayToCSV(deals as Record<string, unknown>[]),
        "deals-transactions.csv",
      );
      break;
    }

    case "leadership": {
      const mod = await import("../../data/mock/leadership");
      const d = mod.default;
      const cxo = d.cxoChanges.map((c) => ({
        type: "CXO Change",
        company: c.company,
        role: c.role,
        incoming: c.incoming ?? "",
        outgoing: c.outgoing ?? "",
        effectiveDate: c.effectiveDate,
        context: c.context,
      }));
      const board = d.boardReshuffles.map((b) => ({
        type: "Board Reshuffle",
        company: b.company,
        change: b.change,
        date: b.date,
        significance: b.significance,
      }));
      const csv =
        "--- CXO Changes ---\n" +
        arrayToCSV(cxo as Record<string, unknown>[]) +
        "\n\n--- Board Reshuffles ---\n" +
        arrayToCSV(board as Record<string, unknown>[]);
      downloadCSV(csv, "leadership-governance.csv");
      break;
    }

    default:
      alert("No tabular data available for CSV export from this section.");
  }
}
