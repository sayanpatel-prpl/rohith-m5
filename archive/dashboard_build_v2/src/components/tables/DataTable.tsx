/**
 * DataTable: Generic TanStack Table wrapper for financial data.
 *
 * Provides sortable/filterable tables with consistent styling
 * matching the dashboard's design system. Optionally renders
 * source attribution below the table (SRCA-03).
 */

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { clsx } from "clsx";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import type { SourceInfo } from "@/types/source";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  sorting?: boolean;
  filtering?: boolean;
  className?: string;
  source?: SourceInfo;
  emptyMessage?: string;
}

export function DataTable<T>({
  data,
  columns,
  sorting = false,
  filtering = false,
  className,
  source,
  emptyMessage = "No data available",
}: DataTableProps<T>) {
  const [sortingState, setSortingState] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: sortingState,
      globalFilter,
    },
    onSortingChange: setSortingState,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    ...(sorting && { getSortedRowModel: getSortedRowModel() }),
    ...(filtering && { getFilteredRowModel: getFilteredRowModel() }),
  });

  const rows = table.getRowModel().rows;

  return (
    <div className={clsx("w-full overflow-x-auto", className)}>
      {filtering && (
        <div className="mb-2">
          <input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Filter..."
            className="text-sm px-3 py-1.5 rounded border border-surface-overlay bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-brand-accent"
          />
        </div>
      )}

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
                      sorting && header.column.getCanSort() && "cursor-pointer select-none hover:text-text-primary",
                      isSorted && "text-brand-accent",
                    )}
                    onClick={sorting ? header.column.getToggleSortingHandler() : undefined}
                  >
                    <span className="inline-flex items-center gap-1">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {sorting && isSorted && (
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
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-surface-raised transition-colors"
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

      {source && (
        <div className="mt-2">
          <SourceAttribution source={source} compact />
        </div>
      )}
    </div>
  );
}
