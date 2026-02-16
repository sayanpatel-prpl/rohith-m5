import clsx from "clsx";

type DealType = "M&A" | "PE/VC" | "IPO" | "distressed";

interface DealTypeBadgeProps {
  type: DealType;
  className?: string;
}

const config: Record<DealType, { label: string; className: string }> = {
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

export function DealTypeBadge({ type, className }: DealTypeBadgeProps) {
  const { label, className: typeClassName } = config[type];
  return (
    <span
      className={clsx(
        "inline-flex items-center px-sm py-xs rounded border text-[10px] font-medium whitespace-nowrap",
        typeClassName,
        className,
      )}
    >
      {label}
    </span>
  );
}
