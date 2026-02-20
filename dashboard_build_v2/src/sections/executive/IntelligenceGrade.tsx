/**
 * EXEC-01: Intelligence Grade Badge
 *
 * Displays a large letter grade (e.g., "B+") in a colored circle.
 * Hover shows methodology and contributing factors via CSS tooltip.
 */

import { clsx } from "clsx";
import type { IntelligenceGrade as IntelligenceGradeType, IntelligenceGradeLevel } from "@/types/executive";

interface IntelligenceGradeProps {
  grade: IntelligenceGradeType;
  className?: string;
}

/** Maps grade levels to semantic color CSS variables */
function getGradeColor(level: IntelligenceGradeLevel): string {
  switch (level) {
    case "A":
    case "A-":
      return "var(--color-positive)";
    case "B+":
    case "B":
      return "var(--color-am-improvement)";
    case "B-":
    case "C+":
    case "C":
      return "var(--color-negative)";
  }
}

export function IntelligenceGrade({ grade, className }: IntelligenceGradeProps) {
  const color = getGradeColor(grade.grade);

  return (
    <div className={clsx("relative group inline-flex flex-col items-center", className)}>
      {/* Grade circle */}
      <div
        className="flex items-center justify-center rounded-full font-bold select-none cursor-help"
        style={{
          width: 60,
          height: 60,
          fontSize: 24,
          color,
          backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
          border: `2px solid ${color}`,
        }}
      >
        {grade.grade}
      </div>

      <span className="text-[10px] text-text-muted mt-1 font-medium">
        Intel Grade
      </span>

      {/* Tooltip on hover */}
      <div
        className={clsx(
          "absolute top-full mt-2 right-0 z-50 w-72 p-3 rounded-lg shadow-lg",
          "bg-surface-raised border border-border-default",
          "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
          "transition-opacity duration-150",
        )}
      >
        <p className="text-xs font-semibold text-text-primary mb-1">
          Intelligence Grade: {grade.grade}
        </p>
        <p className="text-[11px] text-text-secondary mb-2">
          {grade.methodology}
        </p>
        {grade.factors.length > 0 && (
          <>
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wide mb-1">
              Contributing Factors
            </p>
            <ul className="space-y-0.5">
              {grade.factors.map((factor, i) => (
                <li key={i} className="text-[11px] text-text-secondary flex items-start gap-1">
                  <span className="text-text-muted mt-0.5">--</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
