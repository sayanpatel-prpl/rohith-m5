import { useState } from "react";
import { useLocation } from "react-router";
import { useBrand } from "../brand/useBrand";
import { EditionBadge } from "../ui/EditionBadge";
import { ExportToolbar } from "../export/ExportToolbar";
import type { SectionId } from "../../types/common";
import {
  getStoredTheme,
  applyTheme,
  type ThemePreference,
} from "../../theme/dark-mode";

const THEME_CYCLE: ThemePreference[] = ["light", "dark", "system"];

const THEME_ICONS: Record<ThemePreference, string> = {
  light: "\u2600", // Sun
  dark: "\u263E",  // Moon
  system: "\u25D1", // Half circle (monitor/auto)
};

const THEME_LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

/** Valid section IDs that appear in the URL path. */
const SECTION_IDS = new Set<string>([
  "executive", "market-pulse", "financial", "deals", "operations",
  "leadership", "competitive", "deep-dive", "action-lens", "watchlist",
]);

export function TopBar() {
  const brand = useBrand();
  const location = useLocation();
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  // Derive active section from the URL: /:tenantSlug/report/:sectionId
  const segments = location.pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const activeSection: SectionId = SECTION_IDS.has(lastSegment)
    ? (lastSegment as SectionId)
    : "executive";

  function cycleTheme() {
    const currentIndex = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
    setTheme(next);
    applyTheme(next);
  }

  return (
    <header className="h-11 flex items-center justify-between px-md bg-surface-raised border-b border-surface-overlay shrink-0">
      {/* Left: Tenant logo */}
      <div className="flex items-center gap-sm">
        <img
          src={brand.logoUrl}
          alt={`${brand.displayName} logo`}
          className="h-6 w-auto"
        />
      </div>

      {/* Right: Edition badge, Export, Theme toggle */}
      <div className="flex items-center gap-md">
        <EditionBadge edition="February 2026" />

        <div data-print-hide>
          <ExportToolbar activeSection={activeSection} />
        </div>

        {/* Dark mode toggle */}
        <button
          data-print-hide
          onClick={cycleTheme}
          className="flex items-center gap-xs text-xs text-text-secondary hover:text-text-primary
                     px-sm py-xs rounded hover:bg-surface-overlay transition-colors cursor-pointer"
          title={`Theme: ${THEME_LABELS[theme]}`}
        >
          <span className="text-sm">{THEME_ICONS[theme]}</span>
          <span>{THEME_LABELS[theme]}</span>
        </button>
      </div>
    </header>
  );
}
