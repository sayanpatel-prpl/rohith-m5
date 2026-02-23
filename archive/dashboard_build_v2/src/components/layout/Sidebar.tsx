import { NavLink, useParams } from "react-router";
import { SECTION_ROUTES } from "../../app/routes";
import { useBrand } from "../brand/useBrand";

/**
 * Navigation sidebar — navy dark background matching v1 design.
 * Shows brand header with gradient logo icon, section label, and all 11 section routes.
 * Active route: brand-accent left border + highlighted background.
 */
export function Sidebar() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const brand = useBrand();

  return (
    <nav
      data-print-hide
      className="w-[260px] shrink-0 bg-sidebar-bg flex flex-col h-full overflow-hidden"
    >
      {/* Brand header */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          {/* Gradient logo icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{
              background: "linear-gradient(135deg, oklch(0.60 0.18 250), oklch(0.63 0.12 175))",
            }}
          >
            K
          </div>
          <div>
            <div className="font-semibold text-sm text-sidebar-text-active">
              {brand.displayName}
            </div>
            <div className="text-xs text-sidebar-text mt-0.5" style={{ opacity: 0.6 }}>
              Consumer Durables
            </div>
          </div>
        </div>
      </div>

      {/* Section label */}
      <div
        className="px-6 pt-5 pb-2 text-sidebar-text font-semibold"
        style={{ fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5 }}
      >
        Sections
      </div>

      {/* Section navigation */}
      <div className="flex-1 overflow-y-auto pb-4">
        {SECTION_ROUTES.map((section) => (
          <NavLink
            key={section.path}
            to={`/${tenantSlug}/report/${section.path}`}
            className={({ isActive }) =>
              [
                "block text-[0.85rem] py-2.5 px-6 border-l-3 transition-all duration-150",
                isActive
                  ? "text-sidebar-text-active border-l-brand-accent bg-sidebar-active-bg font-semibold"
                  : "text-sidebar-text border-transparent hover:bg-sidebar-hover hover:text-sidebar-text-active",
              ].join(" ")
            }
          >
            {section.label}
          </NavLink>
        ))}
      </div>

      {/* Bottom branding */}
      <div className="px-6 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="text-sidebar-text text-xs" style={{ opacity: 0.4 }}>
          Industry Intel v2.0
        </div>
      </div>
    </nav>
  );
}
