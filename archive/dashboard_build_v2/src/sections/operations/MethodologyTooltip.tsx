/**
 * OPER-01: Methodology Tooltip for derived metric column headers.
 *
 * Renders the column label with a small info icon. On hover, shows an
 * absolute-positioned tooltip with methodology explanation text.
 * Uses the Tailwind group/group-hover pattern established in Executive Snapshot.
 */

interface MethodologyTooltipProps {
  label: string;
  methodology: string;
}

export function MethodologyTooltip({ label, methodology }: MethodologyTooltipProps) {
  return (
    <div className="relative group inline-flex items-center gap-0.5 cursor-help">
      <span>{label}</span>
      <span className="text-[9px] text-text-muted leading-none">(i)</span>

      {/* Hover tooltip */}
      <div className="absolute hidden group-hover:block z-10 top-full left-0 mt-1 max-w-xs bg-surface-overlay border border-border-default rounded p-1.5 text-[10px] text-text-secondary font-normal whitespace-normal shadow-sm">
        {methodology}
      </div>
    </div>
  );
}
