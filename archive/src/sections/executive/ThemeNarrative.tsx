interface ThemeNarrativeProps {
  narrative: string;
}

/**
 * AI narrative block explaining BD relevance for a theme.
 * Renders as a compact muted block with "BD Relevance:" label.
 */
export default function ThemeNarrative({ narrative }: ThemeNarrativeProps) {
  return (
    <div className="bg-surface-raised/30 rounded px-sm py-xs">
      <span className="text-[10px] font-semibold text-text-primary">
        BD Relevance:
      </span>
      <p className="text-[11px] text-text-secondary italic leading-relaxed mt-xs">
        {narrative}
      </p>
    </div>
  );
}
