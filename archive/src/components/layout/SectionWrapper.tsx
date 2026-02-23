import { ErrorBoundary } from "react-error-boundary";
import { SectionErrorFallback } from "../errors/SectionErrorFallback";
import type { ReactNode } from "react";

interface SectionWrapperProps {
  sectionKey: string;
  children: ReactNode;
}

export function SectionWrapper({ sectionKey, children }: SectionWrapperProps) {
  return (
    <ErrorBoundary
      FallbackComponent={SectionErrorFallback}
      resetKeys={[sectionKey]}
    >
      <div className="animate-fade-in h-full overflow-auto">
        {children}
      </div>
    </ErrorBoundary>
  );
}
