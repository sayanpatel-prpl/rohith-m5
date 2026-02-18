import { createContext, useEffect, type ReactNode } from "react";
import { useParams } from "react-router";
import { getBrandConfig } from "../../brands";
import type { BrandConfig } from "../../brands/types";

export const BrandContext = createContext<BrandConfig | null>(null);

export function BrandProvider({ children }: { children: ReactNode }) {
  const { tenantSlug } = useParams<{ tenantSlug: string }>();
  const brand = getBrandConfig(tenantSlug ?? "kompete");

  useEffect(() => {
    // Set data-tenant attribute on documentElement for CSS variable cascade
    document.documentElement.setAttribute("data-tenant", brand.slug);

    // Update favicon
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link) link.href = brand.faviconUrl;

    // Update document title
    document.title = `${brand.displayName} | Industry Intel`;
  }, [brand]);

  return (
    <div data-tenant={brand.slug} className="min-h-screen">
      <BrandContext value={brand}>
        {children}
      </BrandContext>
    </div>
  );
}
