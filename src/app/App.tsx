import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { BrandProvider } from "../components/brand/BrandProvider";
import { AppShell } from "../components/layout/AppShell";
import { SectionWrapper } from "../components/layout/SectionWrapper";
import { SECTION_ROUTES } from "./routes";

/** Simple placeholder rendered inside each section route */
function PlaceholderContent({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-64">
      <h2 className="text-lg font-display font-semibold text-text-primary mb-sm">
        {label}
      </h2>
      <p className="text-xs text-text-muted">
        Module content will be built in a later phase.
      </p>
    </div>
  );
}

export function App() {
  return (
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

          {/* All 10 section routes with SectionWrapper */}
          {SECTION_ROUTES.map((section) => (
            <Route
              key={section.path}
              path={section.path}
              element={
                <SectionWrapper sectionKey={section.path}>
                  <PlaceholderContent label={section.label} />
                </SectionWrapper>
              }
            />
          ))}
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/pricio/report" replace />} />
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/pricio/report" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
