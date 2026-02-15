import type { FallbackProps } from "react-error-boundary";

export function SectionErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full min-h-48
                    bg-surface-raised rounded border border-negative/20 p-lg"
    >
      <p className="text-text-secondary text-sm font-medium mb-sm">
        Unable to load this section
      </p>
      <p className="text-text-muted text-xs mb-md font-mono">
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="text-xs px-md py-xs rounded bg-brand-primary text-white
                   hover:opacity-90 transition-opacity cursor-pointer"
      >
        Retry
      </button>
    </div>
  );
}
