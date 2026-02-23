/**
 * FINP-06: Financial Performance Table
 *
 * Standalone table (using @tanstack/react-table directly) displaying all
 * tracked companies with sortable columns, A&M Signal badges, inline sparklines,
 * and toggleable derived intelligence columns.
 *
 * Built as a standalone table (not wrapping DataTable) to support row click
 * handling for the company drill-down modal (Plan 04).
 */

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { clsx } from "clsx";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import { DataValue } from "@/components/ui/DataValue";
import { formatINRCr, formatINRAuto, formatPercent } from "@/lib/formatters";
import type { FinancialCompanyRow, DerivedColumn } from "@/types/financial";
import type { SourceTier } from "@/types/source";
import { AMSignalBadge } from "./AMSignalBadge";
import { Sparkline } from "./Sparkline";

interface FinancialTableProps {
  companies: FinancialCompanyRow[];
  derivedColumns: DerivedColumn[];
  showDerived: boolean;
  onRowClick?: (row: FinancialCompanyRow) => void;
}

const columnHelper = createColumnHelper<FinancialCompanyRow>();

/** Sub-sector short labels for compact display */
const SUB_SECTOR_SHORT: Record<string, string> = {
  AC: "AC",
  Kitchen: "Kitchen",
  Electrical: "Electrical",
  EMS: "EMS",
  Mixed: "Mixed",
  Cooler: "Cooler",
};

const TABLE_SOURCE = {
  source: "Screener.in + Trendlyne",
  confidence: "verified" as const,
  tier: 1 as SourceTier,
  lastUpdated: "2026-02-18",
  url: "https://www.screener.in/",
};

export function FinancialTable({
  companies,
  derivedColumns,
  showDerived,
  onRowClick,
}: FinancialTableProps) {
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Compute derived values for all companies
  const derivedValues = useMemo(() => {
    const totalRevenue = companies.reduce(
      (sum, c) => sum + (c.metrics.revenue ?? 0),
      0,
    );

    const margins = companies
      .map((c) => c.metrics.ebitdaMargin)
      .filter((v): v is number => v != null && isFinite(v));
    margins.sort((a, b) => a - b);
    const medianMargin =
      margins.length > 0 ? margins[Math.floor(margins.length / 2)] : 0;

    // Competitive intensity by sub-sector (inverse HHI)
    const subSectorRevenue: Record<string, number[]> = {};
    for (const c of companies) {
      const sector = c.subSector ?? "Mixed";
      if (!subSectorRevenue[sector]) subSectorRevenue[sector] = [];
      subSectorRevenue[sector].push(c.metrics.revenue ?? 0);
    }

    const subSectorIntensity: Record<string, number> = {};
    for (const [sector, revs] of Object.entries(subSectorRevenue)) {
      const sectorTotal = revs.reduce((s, r) => s + r, 0);
      if (sectorTotal === 0) {
        subSectorIntensity[sector] = 0;
        continue;
      }
      // HHI = sum of (share_i)^2; intensity = 1/HHI (higher = more competitive)
      const hhi = revs.reduce((s, r) => {
        const share = r / sectorTotal;
        return s + share * share;
      }, 0);
      subSectorIntensity[sector] = hhi > 0 ? Math.round((1 / hhi) * 100) / 100 : 0;
    }

    const map = new Map<
      string,
      { mktShare: number | null; pricingPower: number | null; competitiveIntensity: number | null }
    >();

    for (const c of companies) {
      const rev = c.metrics.revenue ?? 0;
      const margin = c.metrics.ebitdaMargin;
      map.set(c.id, {
        mktShare: totalRevenue > 0 ? (rev / totalRevenue) * 100 : null,
        pricingPower: margin != null ? Math.round((margin - medianMargin) * 100) : null,
        competitiveIntensity: subSectorIntensity[c.subSector ?? "Mixed"] ?? null,
      });
    }

    return map;
  }, [companies]);

  // Build columns -- explicitly typed to allow mixing accessor and display columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Table ColumnDef requires `any` for mixed accessor/display column arrays
  const columns = useMemo(() => {
    const cols: ColumnDef<FinancialCompanyRow, any>[] = [
      // 1. Company name with sub-sector badge
      columnHelper.accessor("name", {
        header: "Company",
        size: 150,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex flex-col gap-0.5">
              <span className="font-medium text-text-primary text-sm leading-tight">
                {info.getValue()}
              </span>
              <span className="text-[10px] text-text-muted">
                {SUB_SECTOR_SHORT[row.subSector] ?? row.subSector}
              </span>
            </div>
          );
        },
      }),

      // 2. A&M Signal
      columnHelper.accessor("amSignal", {
        header: "A&M Signal",
        size: 80,
        cell: (info) => {
          const row = info.row.original;
          return (
            <AMSignalBadge signal={row.amSignal} reason={row.amSignalReason} />
          );
        },
        sortingFn: (rowA, rowB) => {
          const order: Record<string, number> = {
            turnaround: 0,
            improvement: 1,
            transaction: 2,
            neutral: 3,
          };
          return (
            (order[rowA.original.amSignal] ?? 4) -
            (order[rowB.original.amSignal] ?? 4)
          );
        },
      }),

      // 3. Revenue with sparkline
      columnHelper.accessor((row) => row.metrics.revenue, {
        id: "revenue",
        header: "Revenue (Cr)",
        size: 130,
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center gap-1.5">
              <DataValue
                value={info.getValue()}
                formatter={formatINRCr}
                className="text-sm"
              />
              <Sparkline data={row.sparklineData.revenue} />
            </div>
          );
        },
      }),

      // 4. Revenue Growth
      columnHelper.accessor((row) => row.metrics.revenueGrowth, {
        id: "revenueGrowth",
        header: "Rev Growth",
        size: 90,
        cell: (info) => {
          const val = info.getValue();
          if (val == null) return <span className="text-text-muted">-</span>;
          const isPositive = val > 0;
          const isNegative = val < 0;
          return (
            <span
              className={clsx(
                "text-sm font-medium",
                isPositive && "text-positive",
                isNegative && "text-negative",
                !isPositive && !isNegative && "text-text-primary",
              )}
            >
              {formatPercent(val)}
            </span>
          );
        },
      }),

      // 5. EBITDA % with sparkline
      columnHelper.accessor((row) => row.metrics.ebitdaMargin, {
        id: "ebitdaMargin",
        header: "EBITDA %",
        size: 120,
        cell: (info) => {
          const row = info.row.original;
          const val = info.getValue();
          return (
            <div className="flex items-center gap-1.5">
              {val != null ? (
                <span className="text-sm">{formatPercent(val, 1)}</span>
              ) : (
                <span className="text-text-muted">-</span>
              )}
              <Sparkline data={row.sparklineData.ebitdaMargin} />
            </div>
          );
        },
      }),

      // 6. Net Profit
      columnHelper.accessor((row) => row.metrics.netProfit, {
        id: "netProfit",
        header: "Net Profit (Cr)",
        size: 110,
        cell: (info) => (
          <DataValue
            value={info.getValue()}
            formatter={formatINRAuto}
            className="text-sm"
          />
        ),
      }),

      // 7. ROCE %
      columnHelper.accessor((row) => row.metrics.roce, {
        id: "roce",
        header: "ROCE %",
        size: 80,
        cell: (info) => {
          const val = info.getValue();
          if (val == null) return <span className="text-text-muted">-</span>;
          return <span className="text-sm">{formatPercent(val, 1)}</span>;
        },
      }),

      // 8. D/E
      columnHelper.accessor((row) => row.metrics.debtEquity, {
        id: "debtEquity",
        header: "D/E",
        size: 60,
        cell: (info) => {
          const val = info.getValue();
          if (val == null) return <span className="text-text-muted">-</span>;
          return <span className="text-sm">{val.toFixed(2)}</span>;
        },
      }),

      // 9. P/E
      columnHelper.accessor((row) => row.metrics.peRatio, {
        id: "peRatio",
        header: "P/E",
        size: 60,
        cell: (info) => {
          const val = info.getValue();
          if (val == null) return <span className="text-text-muted">-</span>;
          return <span className="text-sm">{val.toFixed(1)}</span>;
        },
      }),
    ];

    // Derived columns (conditionally shown)
    if (showDerived) {
      // 10. Market Share %
      cols.push(
        columnHelper.display({
          id: "mktShare",
          header: () => (
            <span
              title={
                derivedColumns.find((c) => c.id === "mktShare")?.methodology ?? ""
              }
              className="cursor-help inline-flex items-center gap-1"
            >
              Mkt Share %
              <span className="text-[8px] font-medium px-1 py-0 rounded bg-surface-overlay text-text-muted not-italic uppercase tracking-wider">
                Derived
              </span>
            </span>
          ),
          size: 90,
          cell: (info) => {
            const derived = derivedValues.get(info.row.original.id);
            const val = derived?.mktShare;
            if (val == null) return <span className="text-text-muted">-</span>;
            return <span className="text-sm italic">{val.toFixed(1)}%</span>;
          },
        }),
      );

      // 11. Pricing Power
      cols.push(
        columnHelper.display({
          id: "pricingPower",
          header: () => (
            <span
              title={
                derivedColumns.find((c) => c.id === "pricingPower")?.methodology ??
                ""
              }
              className="cursor-help inline-flex items-center gap-1"
            >
              Pricing Power
              <span className="text-[8px] font-medium px-1 py-0 rounded bg-surface-overlay text-text-muted not-italic uppercase tracking-wider">
                Derived
              </span>
            </span>
          ),
          size: 100,
          cell: (info) => {
            const derived = derivedValues.get(info.row.original.id);
            const val = derived?.pricingPower;
            if (val == null) return <span className="text-text-muted">-</span>;
            const isPositive = val > 0;
            const isNegative = val < 0;
            return (
              <span
                className={clsx(
                  "text-sm italic",
                  isPositive && "text-positive",
                  isNegative && "text-negative",
                  !isPositive && !isNegative && "text-text-primary",
                )}
              >
                {val > 0 ? "+" : ""}
                {val} bps
              </span>
            );
          },
        }),
      );

      // 12. Competitive Intensity
      cols.push(
        columnHelper.display({
          id: "competitiveIntensity",
          header: () => (
            <span
              title={
                derivedColumns.find((c) => c.id === "competitiveIntensity")
                  ?.methodology ?? ""
              }
              className="cursor-help inline-flex items-center gap-1"
            >
              Competitive Intensity
              <span className="text-[8px] font-medium px-1 py-0 rounded bg-surface-overlay text-text-muted not-italic uppercase tracking-wider">
                Derived
              </span>
            </span>
          ),
          size: 120,
          cell: (info) => {
            const derived = derivedValues.get(info.row.original.id);
            const val = derived?.competitiveIntensity;
            if (val == null) return <span className="text-text-muted">-</span>;
            return <span className="text-sm italic">{val.toFixed(2)}</span>;
          },
        }),
      );
    }

    return cols;
  }, [showDerived, derivedColumns, derivedValues]);

  const table = useReactTable({
    data: companies,
    columns,
    state: {
      sorting: sortingState,
      globalFilter,
    },
    onSortingChange: setSortingState,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="w-full overflow-x-auto">
      <div className="mb-2">
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Filter companies..."
          className="text-sm px-3 py-1.5 rounded border border-surface-overlay bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const isSorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    className={clsx(
                      "text-left text-xs font-semibold text-text-muted uppercase tracking-wider py-2 px-3 border-b-2 border-surface-overlay",
                      header.column.getCanSort() &&
                        "cursor-pointer select-none hover:text-text-primary",
                      isSorted && "text-brand-accent",
                    )}
                    style={{
                      width: header.column.getSize()
                        ? `${header.column.getSize()}px`
                        : undefined,
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <span className="inline-flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {isSorted && (
                        <span className="text-[10px]">
                          {isSorted === "asc" ? "\u25B2" : "\u25BC"}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center text-sm text-text-muted py-8"
              >
                No companies match the current filter
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className={clsx(
                  "hover:bg-surface-raised transition-colors",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="text-sm py-2.5 px-3 border-b border-surface-overlay"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-2">
        <SourceAttribution source={TABLE_SOURCE} compact />
      </div>
    </div>
  );
}
