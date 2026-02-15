import { use } from "react";
import { BrandContext } from "./BrandProvider";
import type { BrandConfig } from "../../brands/types";

export function useBrand(): BrandConfig {
  const brand = use(BrandContext);
  if (!brand) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return brand;
}
