interface EditionBadgeProps {
  /** Edition label, e.g. "February 2026" */
  edition: string;
}

export function EditionBadge({ edition }: EditionBadgeProps) {
  return (
    <span className="bg-brand-accent/10 text-brand-accent text-xs font-medium px-sm py-xs rounded whitespace-nowrap">
      {edition} Edition
    </span>
  );
}
