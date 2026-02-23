/**
 * Badge: Simple pill badge component.
 *
 * Renders a small colored pill with text content.
 * Variants map to semantic colors from the design tokens.
 */

import { clsx } from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

const VARIANT_CLASSES: Record<BadgeProps["variant"], string> = {
  success: "bg-positive/10 text-positive",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  danger: "bg-negative/10 text-negative",
  info: "bg-neutral/10 text-neutral",
  neutral: "bg-surface-overlay text-text-secondary",
};

export function Badge({ children, variant, size = "sm" }: BadgeProps) {
  const sizeClasses =
    size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium leading-none whitespace-nowrap",
        sizeClasses,
        VARIANT_CLASSES[variant],
      )}
    >
      {children}
    </span>
  );
}
