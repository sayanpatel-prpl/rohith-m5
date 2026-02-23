interface MarginOutlookProps {
  outlook: string;
}

export function MarginOutlook({ outlook }: MarginOutlookProps) {
  return (
    <div className="bg-surface-raised border border-surface-overlay rounded p-md">
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-sm">
        Margin Outlook
      </h3>
      <div className="border-l-2 border-l-neutral pl-md">
        <p className="text-xs text-text-primary leading-relaxed">{outlook}</p>
      </div>
    </div>
  );
}
