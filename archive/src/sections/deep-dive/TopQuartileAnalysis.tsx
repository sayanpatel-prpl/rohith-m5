import type { SubSectorDeepDiveData } from "../../types/sections";

interface TopQuartileAnalysisProps {
  metrics: SubSectorDeepDiveData["topQuartileAnalysis"];
}

export function TopQuartileAnalysis({ metrics }: TopQuartileAnalysisProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Performance Benchmarks
      </h3>

      <div className="space-y-md">
        {metrics.map((m) => {
          // Determine the range for the visual scale
          const min = Math.min(m.topQuartileValue, m.medianValue, m.bottomQuartileValue);
          const max = Math.max(m.topQuartileValue, m.medianValue, m.bottomQuartileValue);
          const range = max - min || 1;

          // Calculate positions (0-100%) for the range bar
          const topPos = ((m.topQuartileValue - min) / range) * 100;
          const medPos = ((m.medianValue - min) / range) * 100;
          const botPos = ((m.bottomQuartileValue - min) / range) * 100;

          return (
            <div key={m.metric} className="space-y-xs">
              {/* Metric name */}
              <div className="text-xs text-text-primary font-medium">
                {m.metric}
              </div>

              {/* Three value comparison */}
              <div className="grid grid-cols-3 gap-sm text-center">
                <div>
                  <div className="text-[10px] text-text-muted">Top Quartile</div>
                  <div className="text-xs font-semibold text-positive">
                    {m.topQuartileValue}{m.unit}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted">Median</div>
                  <div className="text-xs text-text-secondary">
                    {m.medianValue}{m.unit}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-text-muted">Bottom Quartile</div>
                  <div className="text-xs text-negative">
                    {m.bottomQuartileValue}{m.unit}
                  </div>
                </div>
              </div>

              {/* Range visualization */}
              <div className="relative h-2 bg-surface-overlay rounded-full">
                {/* Bottom quartile marker */}
                <div
                  className="absolute top-0 w-2 h-2 rounded-full bg-negative"
                  style={{ left: `calc(${botPos}% - 4px)` }}
                  title={`Bottom: ${m.bottomQuartileValue}${m.unit}`}
                />
                {/* Median marker */}
                <div
                  className="absolute top-0 w-2 h-2 rounded-full bg-text-secondary"
                  style={{ left: `calc(${medPos}% - 4px)` }}
                  title={`Median: ${m.medianValue}${m.unit}`}
                />
                {/* Top quartile marker */}
                <div
                  className="absolute top-0 w-2 h-2 rounded-full bg-positive"
                  style={{ left: `calc(${topPos}% - 4px)` }}
                  title={`Top: ${m.topQuartileValue}${m.unit}`}
                />
              </div>

              {/* Top performers */}
              <div className="flex flex-wrap gap-xs">
                {m.topPerformers.map((performer) => (
                  <span
                    key={performer}
                    className="text-xs bg-positive/10 text-positive px-1.5 py-0.5 rounded"
                  >
                    {performer}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
