export type ThemePreference = "light" | "dark" | "system";

export function getStoredTheme(): ThemePreference {
  const stored = localStorage.getItem("theme-preference");
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function applyTheme(preference: ThemePreference): void {
  const isDark =
    preference === "dark" ||
    (preference === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme-preference", preference);
}

export function initTheme(): void {
  applyTheme(getStoredTheme());

  // Listen for system preference changes when in "system" mode
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (getStoredTheme() === "system") {
        applyTheme("system");
      }
    });
}
