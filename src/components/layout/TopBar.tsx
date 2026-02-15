import { useState } from "react";
import { useBrand } from "../brand/useBrand";
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

export function TopBar() {
  const brand = useBrand();
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme);

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

      {/* Center-right: Edition badge */}
      <div className="flex items-center gap-md">
        <span className="bg-brand-accent/10 text-brand-accent text-xs font-medium px-sm py-xs rounded">
          February 2026 Edition
        </span>

        {/* Right: Dark mode toggle */}
        <button
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
