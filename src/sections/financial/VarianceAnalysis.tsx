interface VarianceAnalysisProps {
  narrative: string;
  source: string;
}

/**
 * Compact variance analysis block shown inside expandable table rows.
 * Displays AI narrative and source attribution.
 */
export function VarianceAnalysis({ narrative, source }: VarianceAnalysisProps) {
  return (
    <div className="bg-surface-raised/30 rounded p-sm space-y-xs">
      <p className="text-xs italic text-text-secondary leading-relaxed">
        {narrative}
      </p>
      <div className="flex items-center gap-xs">
        <span className="text-[10px] font-medium text-text-muted">Source:</span>
        <span className="text-[10px] text-text-muted">{source}</span>
      </div>
    </div>
  );
}
