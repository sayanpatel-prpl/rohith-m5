import clsx from "clsx";

interface DataRecencyTagProps {
  /** Data freshness period, e.g. "Q3 FY25" */
  dataAsOf: string;
  /** Additional CSS classes */
  className?: string;
}

export function DataRecencyTag({ dataAsOf, className }: DataRecencyTagProps) {
  return (
    <span
      className={clsx("text-text-muted text-xs inline-flex items-center gap-xs", className)}
    >
      <span className="text-[10px]">{"\u25CF"}</span>
      <span>Data as of {dataAsOf}</span>
    </span>
  );
}
