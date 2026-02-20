import { createContext, useEffect, type ReactNode } from "react";
import { useParams } from "react-router";
import { getBrandConfig } from "../../brands";
import type { BrandConfig } from "../../brands/types";

export const BrandContext = createContext<BrandConfig | null>(null);

/**
 * BrandProvider reads :tenantSlug from URL params, resolves brand config,
 * and sets data-tenant attribute on document.documentElement for CSS variable
 * overrides defined in tokens.css.
 *
 * Default tenant: "am" (A&M presentation build).
 */
export function BrandProvider({ children }: { children: ReactNode }) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const brand = getBrandConfig(tenantSlug ?? "am");

  useEffect(() => {
    // Set data-tenant attribute on documentElement for CSS variable cascade
    document.documentElement.setAttribute("data-tenant", brand.slug);

    // Update document title
    document.title = `${brand.displayName} | Industry Intel`;
  }, [brand]);

  return (
    <BrandContext value={brand}>
      {children}
    </BrandContext>
  );
}
