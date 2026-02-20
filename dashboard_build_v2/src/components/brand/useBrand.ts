import { use } from "react";
import { BrandContext } from "./BrandProvider";
import type { BrandConfig } from "../../brands/types";

/**
 * Hook to consume BrandContext.
 * Returns { slug, displayName, logoUrl, faviconUrl, accentColor, fontDisplay, fontBody }.
 * Must be used within a BrandProvider.
 */
export function useBrand(): BrandConfig {
  const brand = use(BrandContext);
  if (!brand) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return brand;
}
