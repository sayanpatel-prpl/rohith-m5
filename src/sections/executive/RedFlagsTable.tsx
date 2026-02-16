import { useState } from "react";
import { Collapsible } from "radix-ui";
import clsx from "clsx";
import type { ConfidenceLevel } from "../../types/common";

interface RedFlag {
  company: string;
  signal: string;
  confidence: ConfidenceLevel;
  explanation: string;
}

interface RedFlagsTableProps {
  redFlags: RedFlag[];
}

const CONFIDENCE_STYLES: Record<ConfidenceLevel, string> = {
  high: "bg-negative/10 text-negative border-negative/20",
  medium: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  low: "bg-neutral/10 text-neutral border-neutral/20",
};

/**
 * Red flags table with confidence badges and expandable explanations.
 * Uses CSS Grid layout (not HTML table) to avoid Collapsible DOM nesting issues.
 */
export default function RedFlagsTable({ redFlags }: RedFlagsTableProps) {
  if (redFlags.length === 0) {
    return (
      <p className="text-xs text-text-muted italic py-sm">
        No red flags match current filters.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {/* Header row */}
      <div
        className="grid gap-md px-sm py-xs border-b border-surface-overlay"
        style={{
          gridTemplateColumns: "minmax(100px, 1fr) 2fr auto auto",
        }}
      >
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
          Company
        </span>
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
          Signal
        </span>
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
          Confidence
        </span>
        <span className="text-xs text-text-muted font-medium uppercase tracking-wide">
          {/* Expand column header - intentionally empty */}
        </span>
      </div>

      {/* Data rows */}
      {redFlags.map((flag) => (
        <RedFlagRow key={`${flag.company}-${flag.signal}`} flag={flag} />
      ))}
    </div>
  );
}

function RedFlagRow({ flag }: { flag: RedFlag }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      {/* Main row */}
      <div
        className="grid gap-md items-center px-sm py-xs border-b border-surface-overlay hover:bg-surface-raised/50 transition-colors"
        style={{
          gridTemplateColumns: "minmax(100px, 1fr) 2fr auto auto",
        }}
      >
        <span className="text-xs text-text-primary font-medium">
          {flag.company}
        </span>
        <span className="text-xs text-text-secondary line-clamp-2">
          {flag.signal}
        </span>
        <span
          className={clsx(
            "inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium uppercase tracking-wide whitespace-nowrap",
            CONFIDENCE_STYLES[flag.confidence],
          )}
        >
          {flag.confidence.toUpperCase()}
        </span>
        <Collapsible.Trigger
          className="text-text-muted hover:text-text-primary cursor-pointer transition-colors p-xs"
          aria-label={`Expand explanation for ${flag.company}`}
        >
          <span
            className={clsx(
              "text-[10px] inline-block transition-transform duration-150",
              open && "rotate-90",
            )}
          >
            {"\u25B6"}
          </span>
        </Collapsible.Trigger>
      </div>

      {/* Expandable explanation row */}
      <Collapsible.Content>
        <div className="bg-surface-raised/30 px-sm py-sm">
          <p className="text-xs text-text-secondary italic leading-relaxed">
            {flag.explanation}
          </p>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
