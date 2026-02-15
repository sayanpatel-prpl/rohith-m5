export interface BrandConfig {
  slug: string;
  displayName: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string; // oklch value for CSS override
  fontDisplay: string; // Font family for headings
  fontBody: string; // Font family for body text
}
