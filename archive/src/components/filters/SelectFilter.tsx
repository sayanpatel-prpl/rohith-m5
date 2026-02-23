import { Select } from "radix-ui";

interface SelectFilterProps {
  /** Label shown before the trigger */
  label: string;
  /** Currently selected value */
  value: string;
  /** Available options */
  options: Array<{ value: string; label: string }>;
  /** Called when selection changes */
  onChange: (value: string) => void;
}

/**
 * Reusable single-select filter dropdown using Radix Select.
 * Compact Bloomberg-terminal styling: text-xs, dark surface background.
 */
export function SelectFilter({
  label,
  value,
  options,
  onChange,
}: SelectFilterProps) {
  return (
    <div className="flex items-center gap-xs">
      <span className="text-xs text-text-muted whitespace-nowrap">{label}</span>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="inline-flex items-center gap-xs px-sm py-xs text-xs bg-surface-raised border border-surface-overlay rounded min-w-24 hover:bg-surface-overlay transition-colors cursor-pointer outline-none focus:ring-1 focus:ring-brand-accent">
          <Select.Value />
          <Select.Icon className="text-text-muted">
            <span className="text-[10px]">{"\u25BE"}</span>
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content
            className="bg-surface-raised border border-surface-overlay rounded shadow-lg z-50 overflow-hidden"
            position="popper"
            sideOffset={4}
          >
            <Select.Viewport className="p-xs">
              {options.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className="text-xs px-sm py-xs rounded cursor-pointer outline-none text-text-primary data-[highlighted]:bg-surface-overlay data-[state=checked]:text-brand-accent"
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
