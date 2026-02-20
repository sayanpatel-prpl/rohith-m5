import { NavLink, useParams } from "react-router";
import { SECTION_ROUTES } from "../../app/routes";
import { useBrand } from "../brand/useBrand";

/**
 * Navigation sidebar with section links.
 * Shows brand header, subtitle, and all 11 section routes.
 * Active route: brand-accent left border + highlighted background.
 */
export function Sidebar() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const brand = useBrand();

  return (
    <nav
      data-print-hide
      className="w-[260px] shrink-0 bg-surface border-r border-surface-overlay flex flex-col h-full overflow-hidden"
    >
      {/* Brand header */}
      <div className="px-5 py-4 border-b border-surface-overlay">
        <div className="font-semibold text-sm text-text-primary">
          {brand.displayName}
        </div>
        <div className="text-xs text-text-muted mt-0.5">
          Industry Intel — Consumer Durables
        </div>
      </div>

      {/* Section navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {SECTION_ROUTES.map((section) => (
          <NavLink
            key={section.path}
            to={`/${tenantSlug}/report/${section.path}`}
            className={({ isActive }) =>
              [
                "block text-sm py-2.5 px-5 border-l-3 transition-colors",
                isActive
                  ? "text-brand-accent border-l-brand-accent bg-surface-overlay font-semibold"
                  : "text-text-secondary border-transparent hover:bg-surface-overlay hover:text-text-primary",
              ].join(" ")
            }
          >
            {section.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
