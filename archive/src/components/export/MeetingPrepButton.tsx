interface MeetingPrepButtonProps {
  onClick: () => void;
}

/**
 * Compact button matching ExportToolbar style for triggering Meeting Prep dialog.
 * Hidden in print via data-print-hide.
 */
export default function MeetingPrepButton({ onClick }: MeetingPrepButtonProps) {
  return (
    <button
      data-print-hide
      onClick={onClick}
      className="text-xs font-medium px-sm py-xs bg-surface-raised border border-surface-overlay
                 rounded hover:bg-surface-overlay transition-colors cursor-pointer
                 flex items-center gap-xs text-text-secondary hover:text-text-primary"
    >
      Meeting Prep
    </button>
  );
}
