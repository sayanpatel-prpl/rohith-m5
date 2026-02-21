import { Suspense } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { queryClient } from "../api/query-client";
import { BrandProvider } from "../components/brand/BrandProvider";
import { AppShell } from "../components/layout/AppShell";
import { SectionSkeleton } from "../components/ui/SectionSkeleton";
import { SectionErrorFallback } from "../components/errors/SectionErrorFallback";
import { lazySections } from "../sections";
import { SECTION_ROUTES } from "./routes";
import type { SectionId } from "../types/common";

/**
 * Root application component.
 * Wires: QueryClientProvider -> HashRouter -> BrandProvider -> AppShell -> section routes.
 * HashRouter for file:// protocol compatibility (offline single-file demo).
 * No ReactQueryDevtools (production presentation build).
 * Default tenant: "am" (A&M).
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <Routes>
          <Route
            path="/:tenantSlug/report"
            element={
              <BrandProvider>
                <AppShell />
              </BrandProvider>
            }
          >
            {/* Default to executive section */}
            <Route index element={<Navigate to="executive" replace />} />

            {/* All 11 section routes with lazy-loaded components */}
            {SECTION_ROUTES.map((section) => {
              const LazySection = lazySections[section.path as SectionId];
              return (
                <Route
                  key={section.path}
                  path={section.path}
                  element={
                    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
                      <Suspense
                        fallback={<SectionSkeleton variant="mixed" />}
                      >
                        <LazySection />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
              );
            })}
          </Route>

          {/* Default redirect — A&M is default tenant */}
          <Route
            path="/"
            element={<Navigate to="/am/report" replace />}
          />
          {/* Catch-all redirect */}
          <Route
            path="*"
            element={<Navigate to="/am/report" replace />}
          />
        </Routes>
      </HashRouter>
    </QueryClientProvider>
  );
}
