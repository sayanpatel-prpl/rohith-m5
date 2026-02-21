/**
 * Deal Type Badge
 *
 * Renders a color-coded pill badge for the deal classification type.
 * Maps deal types to semantic badge variants.
 */

import { Badge } from "@/components/ui/Badge";
import type { DealType } from "@/types/deals";

interface DealTypeBadgeProps {
  dealType: DealType;
  label: string;
}

const TYPE_VARIANT: Record<DealType, "success" | "warning" | "danger" | "info" | "neutral"> = {
  acquisition: "info",
  investment: "success",
  qip: "warning",
  fundraise: "warning",
  "land-allotment": "neutral",
  rating: "neutral",
  partnership: "success",
  other: "neutral",
};

export function DealTypeBadge({ dealType, label }: DealTypeBadgeProps) {
  return (
    <Badge variant={TYPE_VARIANT[dealType]} size="sm">
      {label}
    </Badge>
  );
}
