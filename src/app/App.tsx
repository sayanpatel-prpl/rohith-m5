import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "../api/query-client";
import { BrandProvider } from "../components/brand/BrandProvider";
import { AppShell } from "../components/layout/AppShell";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { SectionSkeleton } from "../components/ui/SectionSkeleton";
import { lazySections } from "../components/sections";
import { SECTION_ROUTES } from "./routes";
import type { SectionId } from "../types/common";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/:tenantSlug/report"
            element={
              <BrandProvider>
                <AppShell />
              </BrandProvider>
            }
          >
            {/* Default to first section */}
            <Route index element={<Navigate to="executive" replace />} />

            {/* All 10 section routes with lazy-loaded components */}
            {SECTION_ROUTES.map((section) => {
              const LazySection =
                lazySections[section.path as SectionId];
              return (
                <Route
                  key={section.path}
                  path={section.path}
                  element={
                    <SectionWrapper sectionKey={section.path}>
                      <Suspense
                        fallback={<SectionSkeleton variant="mixed" />}
                      >
                        <LazySection />
                      </Suspense>
                    </SectionWrapper>
                  }
                />
              );
            })}
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/kompete/report" replace />} />
          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/kompete/report" replace />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
