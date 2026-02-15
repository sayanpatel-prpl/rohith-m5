import { NavLink, useParams } from "react-router";
import { SECTION_ROUTES } from "../../app/routes";

export function Sidebar() {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();

  return (
    <nav className="w-50 bg-surface border-r border-surface-overlay shrink-0 overflow-y-auto">
      <div className="py-sm">
        {SECTION_ROUTES.map((section) => (
          <NavLink
            key={section.path}
            to={`/${tenantSlug}/report/${section.path}`}
            className={({ isActive }) =>
              [
                "block px-md py-sm text-xs transition-colors",
                isActive
                  ? "bg-brand-accent/10 text-brand-accent border-l-2 border-brand-accent font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-raised border-l-2 border-transparent",
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
