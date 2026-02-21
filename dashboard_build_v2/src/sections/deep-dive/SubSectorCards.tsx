/**
 * SSDD-01, SSDD-03: Sub-Sector Breakdown Cards
 *
 * Responsive grid of cards showing per-sub-sector aggregate metrics:
 * revenue growth, EBITDA margin, ROCE, and OPM quartile distribution.
 * Each card includes top/bottom performers and source attribution.
 */

import { SourceAttribution } from "@/components/source";
import { formatPercent } from "@/lib/formatters";
import type { SubSectorBreakdown, SubSectorId } from "@/types/deep-dive";

interface SubSectorCardsProps {
  subSectors: SubSectorBreakdown[];
}

/** Logical display order for sub-sectors */
const SECTOR_ORDER: SubSectorId[] = [
  "AC",
  "Kitchen",
  "Electrical",
  "EMS",
  "Mixed",
  "Cooler",
];

function sortSubSectors(sectors: SubSectorBreakdown[]): SubSectorBreakdown[] {
  return [...sectors].sort((a, b) => {
    const ai = SECTOR_ORDER.indexOf(a.subSector);
    const bi = SECTOR_ORDER.indexOf(b.subSector);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });
}

export function SubSectorCards({ subSectors }: SubSectorCardsProps) {
  const sorted = sortSubSectors(subSectors);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
      {sorted.map((sector) => (
        <SubSectorCard key={sector.subSector} sector={sector} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual Card
// ---------------------------------------------------------------------------

function SubSectorCard({ sector }: { sector: SubSectorBreakdown }) {
  const growthColor =
    sector.avgRevenueGrowth >= 0 ? "text-[var(--color-positive)]" : "text-[var(--color-negative)]";

  return (
    <div className="bg-surface-raised border border-border-default rounded p-md space-y-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-base text-text-primary">
          {sector.label}
        </h4>
        <span className="text-[10px] bg-surface-overlay text-text-muted px-1.5 py-0.5 rounded">
          {sector.companyCount} {sector.companyCount === 1 ? "company" : "companies"}
        </span>
      </div>

      {/* Metrics 2x2 grid */}
      <div className="grid grid-cols-2 gap-sm">
        <MetricCell
          label="Avg Revenue Growth"
          value={formatPercent(sector.avgRevenueGrowth)}
          className={growthColor}
        />
        <MetricCell
          label="Avg EBITDA Margin"
          value={`${sector.avgEbitdaMargin.toFixed(1)}%`}
        />
        <MetricCell
          label="Avg ROCE"
          value={`${sector.avgROCE.toFixed(1)}%`}
        />
        <MetricCell
          label="OPM Range"
          value={`P25: ${sector.opmQuartiles.p25.toFixed(1)}% | Med: ${sector.opmQuartiles.median.toFixed(1)}% | P75: ${sector.opmQuartiles.p75.toFixed(1)}%`}
          small
        />
      </div>

      {/* Top / Bottom performers */}
      <div className="flex items-center justify-between text-xs">
        <span>
          <span className="text-text-muted">Top: </span>
          <span className="text-[var(--color-positive)] font-medium">
            {sector.topPerformer}
          </span>
        </span>
        <span>
          <span className="text-text-muted">Bottom: </span>
          <span className="text-text-muted font-medium">
            {sector.bottomPerformer}
          </span>
        </span>
      </div>

      {/* Source attribution (SSDD-03) */}
      <SourceAttribution source={sector.source} compact />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Metric Cell
// ---------------------------------------------------------------------------

function MetricCell({
  label,
  value,
  className,
  small,
}: {
  label: string;
  value: string;
  className?: string;
  small?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] text-text-muted">{label}</p>
      <p
        className={`${small ? "text-[11px]" : "text-sm"} font-semibold ${className ?? "text-text-primary"}`}
      >
        {value}
      </p>
    </div>
  );
}
