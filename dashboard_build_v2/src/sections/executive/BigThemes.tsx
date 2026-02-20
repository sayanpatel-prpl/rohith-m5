/**
 * EXEC-03: Big Themes
 *
 * Displays cross-company strategic themes with source attribution.
 * Max 7 shown, with overflow indicator.
 */

import { clsx } from "clsx";
import type { BigTheme } from "@/types/executive";
import { SourceAttribution } from "@/components/source/SourceAttribution";
import { Badge } from "@/components/ui/Badge";

interface BigThemesProps {
  themes: BigTheme[];
  className?: string;
}

const MAX_VISIBLE = 7;

export function BigThemes({ themes, className }: BigThemesProps) {
  if (themes.length === 0) {
    return (
      <div className={clsx("rounded-lg bg-surface-raised p-lg", className)}>
        <h3 className="text-sm font-semibold text-text-primary mb-sm uppercase tracking-wide">
          Big Themes
        </h3>
        <p className="text-sm text-text-muted">No themes detected in current data.</p>
      </div>
    );
  }

  const visibleThemes = themes.slice(0, MAX_VISIBLE);
  const remaining = themes.length - MAX_VISIBLE;

  return (
    <div className={clsx("rounded-lg bg-surface-raised p-lg", className)}>
      <h3 className="text-sm font-semibold text-text-primary mb-md uppercase tracking-wide">
        Big Themes
        <span className="ml-2 text-text-muted font-normal text-xs">({themes.length})</span>
      </h3>

      <div className="space-y-3">
        {visibleThemes.map((theme, i) => (
          <div
            key={i}
            className="p-3 rounded border border-border-default bg-surface/50 space-y-2"
          >
            <p className="text-sm font-semibold text-text-primary leading-snug">
              {theme.theme}
            </p>
            <p className="text-xs text-text-secondary leading-relaxed">
              {theme.detail}
            </p>

            {/* Companies affected */}
            {theme.companiesAffected.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {theme.companiesAffected.map((company) => (
                  <Badge key={company} variant="neutral" size="sm">
                    {company}
                  </Badge>
                ))}
              </div>
            )}

            {/* Source attribution */}
            <SourceAttribution source={theme.source} compact />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <p className="text-xs text-text-muted mt-2">
          and {remaining} more...
        </p>
      )}
    </div>
  );
}
