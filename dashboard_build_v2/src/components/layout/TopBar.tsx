import { useState } from "react";
import { useLocation } from "react-router";
import { SECTION_ROUTES } from "../../app/routes";
import {
  getStoredTheme,
  applyTheme,
  type ThemePreference,
} from "../../theme/dark-mode";

const THEME_CYCLE: ThemePreference[] = ["light", "dark", "system"];

const THEME_ICONS: Record<ThemePreference, string> = {
  light: "\u2600", // Sun
  dark: "\u263E", // Moon
  system: "\u25D1", // Half circle
};

const THEME_LABELS: Record<ThemePreference, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

/**
 * Top bar showing section title, data recency, dark mode toggle, and print button.
 */
export function TopBar() {
  const location = useLocation();
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

  // Derive section title from URL path
  const segments = location.pathname.split("/");
  const lastSegment = segments[segments.length - 1];
  const currentSection = SECTION_ROUTES.find((s) => s.path === lastSegment);
  const sectionTitle = currentSection?.label ?? "Executive Snapshot";

  function cycleTheme() {
    const currentIndex = THEME_CYCLE.indexOf(theme);
    const next = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
    setTheme(next);
    applyTheme(next);
  }

  return (
    <header className="h-12 flex items-center justify-between px-6 bg-surface-raised shadow-sm shrink-0"
      style={{ borderBottom: "1px solid oklch(0.90 0.01 250)" }}>
      {/* Left: Section title + data recency */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-semibold text-text-primary tracking-tight">
          {sectionTitle}
        </h1>
        <span className="text-xs text-text-muted px-2 py-0.5 rounded-full bg-surface-overlay">
          Q3 FY2026 | Screener.in
        </span>
      </div>

      {/* Right: Dark mode toggle + Print */}
      <div className="flex items-center gap-1" data-print-hide>
        <button
          onClick={cycleTheme}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary
                     px-2.5 py-1.5 rounded-md hover:bg-surface-overlay transition-colors cursor-pointer"
          title={`Theme: ${THEME_LABELS[theme]}`}
        >
          <span className="text-sm">{THEME_ICONS[theme]}</span>
          <span>{THEME_LABELS[theme]}</span>
        </button>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary
                     px-2.5 py-1.5 rounded-md hover:bg-surface-overlay transition-colors cursor-pointer"
          title="Print report"
        >
          <span className="text-sm">{"\u2399"}</span>
          <span>Print</span>
        </button>
      </div>
    </header>
  );
}
