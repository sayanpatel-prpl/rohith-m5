import clsx from "clsx";
import { Checkbox, Tooltip, Collapsible } from "radix-ui";
import { PerformanceTag } from "../../components/ui/PerformanceTag";
import { VarianceAnalysis } from "./VarianceAnalysis";
import type { FinancialPerformanceData } from "../../types/sections";

type Company = FinancialPerformanceData["companies"][number];

interface MetricsTableRowProps {
  company: Company;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  selectionDisabled: boolean;
}

/**
 * Single company row in the financial metrics table.
 * Uses CSS Grid (inherits grid-template-columns from parent MetricsTable).
 * Includes Radix Checkbox for comparison selection, metrics display,
 * source attribution tooltip, and expandable variance analysis.
 */
export function MetricsTableRow({
  company,
  isSelected,
  onToggleSelect,
  isExpanded,
  onToggleExpand,
  selectionDisabled,
}: MetricsTableRowProps) {
  const { metrics } = company;
  const revenuePositive = metrics.revenueGrowthYoY >= 0;

  return (
    <Collapsible.Root
      open={isExpanded}
      onOpenChange={() => onToggleExpand(company.id)}
    >
      {/* Data row */}
      <div
        className="grid items-center border-b border-surface-overlay hover:bg-surface-raised/50 transition-colors"
        style={{
          gridTemplateColumns:
            "32px minmax(140px, 1.5fr) repeat(5, minmax(75px, 1fr)) 36px 32px",
        }}
      >
        {/* Checkbox */}
        <div className="flex items-center justify-center px-xs">
          <Checkbox.Root
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(company.id)}
            disabled={selectionDisabled && !isSelected}
            className={clsx(
              "h-3.5 w-3.5 rounded border border-text-muted flex items-center justify-center",
              "data-[state=checked]:bg-brand-accent data-[state=checked]:border-brand-accent",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent",
              selectionDisabled &&
                !isSelected &&
                "opacity-30 cursor-not-allowed",
            )}
          >
            <Checkbox.Indicator>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className="text-white"
              >
                <path
                  d="M2 5L4 7L8 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Checkbox.Indicator>
          </Checkbox.Root>
        </div>

        {/* Company name + performance tag */}
        <div className="flex items-center gap-sm px-sm py-xs min-w-0">
          <span className="text-xs font-medium text-text-primary truncate">
            {company.name}
          </span>
          <PerformanceTag level={company.performance} compact />
        </div>

        {/* Revenue Growth YoY */}
        <div
          className={clsx(
            "text-xs text-right px-sm py-xs font-mono",
            revenuePositive ? "text-positive" : "text-negative",
          )}
        >
          {(metrics.revenueGrowthYoY >= 0 ? "+" : "")}
          {(metrics.revenueGrowthYoY * 100).toFixed(1)}%
        </div>

        {/* EBITDA Margin */}
        <div className="text-xs text-right px-sm py-xs font-mono text-text-primary">
          {(metrics.ebitdaMargin * 100).toFixed(1)}%
        </div>

        {/* Working Capital Days */}
        <div className="text-xs text-right px-sm py-xs font-mono text-text-primary">
          {metrics.workingCapitalDays} days
        </div>

        {/* ROCE */}
        <div className="text-xs text-right px-sm py-xs font-mono text-text-primary">
          {(metrics.roce * 100).toFixed(1)}%
        </div>

        {/* Debt/Equity */}
        <div className="text-xs text-right px-sm py-xs font-mono text-text-primary">
          {metrics.debtEquity.toFixed(2)}x
        </div>

        {/* Source attribution */}
        <div className="flex items-center justify-center">
          <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button className="text-[10px] text-text-muted hover:text-text-secondary cursor-help underline decoration-dotted">
                  Src
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-surface-overlay border border-surface-overlay rounded shadow-lg px-md py-sm text-xs text-text-primary z-50"
                  sideOffset={4}
                >
                  {company.source}
                  <Tooltip.Arrow className="fill-surface-overlay" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        {/* Expand chevron */}
        <div className="flex items-center justify-center">
          <Collapsible.Trigger asChild>
            <button
              className="text-text-muted hover:text-text-primary p-xs rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-accent"
              aria-label={`${isExpanded ? "Collapse" : "Expand"} variance analysis for ${company.name}`}
            >
              <span
                className={clsx(
                  "inline-block text-[10px] transition-transform duration-150",
                  isExpanded && "rotate-90",
                )}
              >
                {"\u25B6"}
              </span>
            </button>
          </Collapsible.Trigger>
        </div>
      </div>

      {/* Expandable variance analysis */}
      <Collapsible.Content>
        <div
          className="grid border-b border-surface-overlay"
          style={{
            gridTemplateColumns:
              "32px minmax(140px, 1.5fr) repeat(5, minmax(75px, 1fr)) 36px 32px",
          }}
        >
          <div style={{ gridColumn: "1 / -1" }} className="px-md py-sm">
            <VarianceAnalysis
              narrative={company.varianceAnalysis}
              source={company.source}
            />
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
