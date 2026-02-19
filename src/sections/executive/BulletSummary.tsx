import { useState } from "react";
import { Collapsible } from "radix-ui";
import clsx from "clsx";
import type { ConfidenceLevel } from "../../types/common";
import ThemeNarrative from "./ThemeNarrative";

interface Bullet {
  text: string;
  theme: string;
  significance: ConfidenceLevel;
  narrative: string;
}

interface BulletSummaryProps {
  bullets: Bullet[];
}

const SIGNIFICANCE_STYLES: Record<ConfidenceLevel, string> = {
  high: "bg-negative/10 text-negative border-negative/20",
  medium: "bg-brand-accent/10 text-brand-accent border-brand-accent/20",
  low: "bg-neutral/10 text-neutral border-neutral/20",
};

/**
 * 5-bullet monthly summary grid with significance badges
 * and expandable AI narrative per theme.
 */
export default function BulletSummary({ bullets }: BulletSummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
      {bullets.map((bullet) => (
        <BulletCard key={bullet.theme} bullet={bullet} />
      ))}
    </div>
  );
}

function BulletCard({ bullet }: { bullet: Bullet }) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <div className="bg-surface-raised border border-surface-overlay rounded-lg p-lg space-y-md hover:shadow-sm transition-shadow">
        {/* Header: theme name + significance badge */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary">
            {bullet.theme}
          </span>
          <span
            className={clsx(
              "text-xs font-medium px-md py-xs rounded-full border uppercase tracking-wide",
              SIGNIFICANCE_STYLES[bullet.significance],
            )}
          >
            {bullet.significance}
          </span>
        </div>

        {/* Bullet text */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {bullet.text}
        </p>

        {/* Expandable narrative trigger */}
        <Collapsible.Trigger className="inline-flex items-center gap-xs text-xs text-brand-accent hover:text-brand-primary cursor-pointer transition-colors font-medium">
          <span>View BD Insight</span>
          <span
            className={clsx(
              "text-[10px] transition-transform duration-150",
              open && "rotate-90",
            )}
          >
            {"\u25B6"}
          </span>
        </Collapsible.Trigger>

        {/* Expandable narrative content */}
        <Collapsible.Content>
          <ThemeNarrative narrative={bullet.narrative} />
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
