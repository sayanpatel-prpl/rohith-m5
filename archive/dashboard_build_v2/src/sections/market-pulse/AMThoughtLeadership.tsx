/**
 * A&M Thought Leadership callout component.
 *
 * MRKT-03: Prominent callout box displaying A&M insight report reference
 * with brand-accent styling, summary, and link to full report.
 */

interface AMThoughtLeadershipProps {
  title: string;
  summary: string;
  url: string;
  source: string;
}

export function AMThoughtLeadership({
  title,
  summary,
  url,
  source,
}: AMThoughtLeadershipProps) {
  return (
    <div className="rounded border-l-2 border-l-brand-accent border border-surface-overlay bg-brand-accent/5 p-md">
      {/* Label */}
      <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-accent">
        A&M Insight
      </span>

      {/* Title */}
      <h4 className="text-xs font-medium text-text-primary mt-xs leading-snug">
        {title}
      </h4>

      {/* Summary */}
      <p className="text-xs text-text-secondary mt-xs line-clamp-3">
        {summary}
      </p>

      {/* Footer: link + source */}
      <div className="flex items-center justify-between mt-sm">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-brand-accent hover:underline inline-flex items-center gap-0.5"
        >
          Read full report
          <span aria-hidden="true">{" \u2197"}</span>
        </a>
        <span className="text-[10px] text-text-muted">{source}</span>
      </div>
    </div>
  );
}
