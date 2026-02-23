import clsx from "clsx";

export interface BadgeVariant {
  label: string;
  className: string;
  icon?: string;
}

export interface BadgeProps<K extends string = string> {
  variant: K;
  config: Record<K, BadgeVariant>;
  compact?: boolean;
  compactMode?: "first-char" | "icon-only";
  size?: "xs" | "2xs";
  className?: string;
}

export function Badge<K extends string>({
  variant,
  config,
  compact = false,
  compactMode = "first-char",
  size = "2xs",
  className,
}: BadgeProps<K>) {
  const entry = config[variant];
  const textSize = size === "2xs" ? "text-[10px]" : "text-xs";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded border font-medium whitespace-nowrap px-sm py-xs",
        textSize,
        entry.icon && "gap-xs",
        entry.className,
        className,
      )}
    >
      {entry.icon && <span className="text-[10px]">{entry.icon}</span>}
      {compact && compactMode === "icon-only"
        ? null
        : compact && compactMode === "first-char"
          ? entry.label[0].toUpperCase()
          : entry.label}
    </span>
  );
}
