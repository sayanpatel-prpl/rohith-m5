# Architecture Decisions

| Date | Decision | Rationale | Outcome |
|------|----------|-----------|---------|
| 2026-02-20 | Use ECharts over Recharts | Heatmaps, treemaps, and high data density visualizations require ECharts. Recharts lacks heatmap/treemap support without plugins. | ECharts ^5.5 with tree-shaken core (6 chart types) via echarts-for-react/core |
| 2026-02-20 | Static JSON import via @data alias | Single-file output (vite-plugin-singlefile) requires build-time data inlining. Runtime fetch impossible in offline HTML. @data Vite alias resolves to data_sources/extracted/. | All data files imported at build time and bundled into single HTML |
| 2026-02-20 | Zustand v5 with primitive selectors | Zustand v5 strict equality comparison causes re-render loops when using object selectors. Individual primitive selectors prevent this. | useFilterStore((s) => s.companies) pattern used everywhere |
| 2026-02-20 | A&M as default tenant | Presentation audience is A&M partners. Default redirect goes to /am/report instead of /kompete/report. | BrandProvider defaults to "am" slug, getBrandConfig falls back to amBrand |
| 2026-02-20 | ECharts v5 (not v6) | echarts-for-react v3.0.6 compatibility uncertain with ECharts v6. v5 is proven stable with the wrapper library. | echarts: "^5.5" in package.json |
| 2026-02-20 | Anti-clickbait news filtering at data layer | Low-credibility sources must never reach the UI. Filtering in the data loader ensures no section component can accidentally display unvetted news. | NEWS-02 filtering in src/data/loaders/news.ts with cached empty array for missing data |
| 2026-02-21 | Inline style for tier badge colors | Tailwind v4 @theme utility classes work but inline style with var(--color-tier-X) ensures reliable rendering regardless of utility generation. | TierBadge uses inline style={} with CSS variable references |
| 2026-02-21 | color-mix(in oklch) for AM tints | Native CSS function avoids extra Tailwind utility classes for 10% tint backgrounds on AMServiceLineTag. | Supported in all modern browsers |
| 2026-02-21 | Generic DataTable<T> | Type-safe column definitions across all section tables. Generic prop ensures columns match row data type. | DataTable uses TanStack Table generic pattern |
| 2026-02-21 | Company registry includes daikin/jch | Both appear in sovrenn data despite absence from most other data files. Including them ensures complete coverage. | COMPANIES array has 16 entries including inferred metadata for daikin and jch |
