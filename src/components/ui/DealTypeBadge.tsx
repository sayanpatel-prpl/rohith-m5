import { Badge } from "./Badge";
import type { BadgeVariant } from "./Badge";

type DealType = "M&A" | "PE/VC" | "IPO" | "distressed";

const config: Record<DealType, BadgeVariant> = {
  "M&A": {
    label: "M&A",
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  "PE/VC": {
    label: "PE/VC",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  IPO: {
    label: "IPO",
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  distressed: {
    label: "Distressed",
    className: "bg-negative/10 text-negative border-negative/20",
  },
};

interface DealTypeBadgeProps {
  type: DealType;
  className?: string;
}

export function DealTypeBadge({ type, className }: DealTypeBadgeProps) {
  return <Badge variant={type} config={config} size="2xs" className={className} />;
}
