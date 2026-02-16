import { formatDate } from "../../lib/formatters";
import type { CompetitiveMovesData } from "../../types/sections";

interface ProductLaunchesProps {
  launches: CompetitiveMovesData["productLaunches"];
}

/** Config-record: category -> badge styling */
const categoryBadge: Record<string, string> = {
  "Air Conditioning": "bg-chart-1/10 text-chart-1 border-chart-1/20",
  "Home Appliances": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Kitchen Appliances": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  Fans: "bg-chart-4/10 text-chart-4 border-chart-4/20",
};

const defaultBadge = "bg-chart-5/10 text-chart-5 border-chart-5/20";

export function ProductLaunches({ launches }: ProductLaunchesProps) {
  return (
    <div className="space-y-sm">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide">
        Product Launches & New SKUs
      </h3>

      {launches.length === 0 ? (
        <p className="text-xs text-text-muted italic">
          No product launches in this period.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-sm">
          {launches.map((launch, i) => (
            <div
              key={`${launch.company}-${launch.product}-${i}`}
              className="bg-surface-raised border border-surface-overlay rounded p-sm space-y-xs"
            >
              {/* Company + category badge */}
              <div className="flex items-center justify-between gap-xs">
                <span className="text-xs font-semibold text-text-primary truncate">
                  {launch.company}
                </span>
                <span
                  className={`inline-flex items-center text-xs px-1.5 py-0.5 rounded border whitespace-nowrap ${categoryBadge[launch.category] ?? defaultBadge}`}
                >
                  {launch.category}
                </span>
              </div>

              {/* Product name */}
              <p className="text-xs text-text-primary font-medium">
                {launch.product}
              </p>

              {/* Positioning note */}
              <p className="text-xs text-text-secondary leading-relaxed">
                {launch.positioningNote}
              </p>

              {/* Date */}
              <p className="text-[10px] text-text-muted">
                {formatDate(launch.date)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
