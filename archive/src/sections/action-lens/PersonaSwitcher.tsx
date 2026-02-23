import { Tabs } from "radix-ui";
import { PersonaTakeaways } from "./PersonaTakeaways";
import type { ActionLensData } from "../../types/sections";

interface PersonaSwitcherProps {
  personas: ActionLensData["personas"];
}

/**
 * Radix Tabs switcher for persona-based views.
 * Each tab shows persona-specific takeaways with actionable steps.
 */
export function PersonaSwitcher({ personas }: PersonaSwitcherProps) {
  return (
    <div>
      <h3 className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-sm">
        What This Means For...
      </h3>

      <Tabs.Root defaultValue="PE/Investors">
        <Tabs.List className="flex gap-xs border-b border-surface-overlay mb-md">
          {personas.map((p) => (
            <Tabs.Trigger
              key={p.persona}
              value={p.persona}
              className="text-xs px-sm py-xs font-medium text-text-muted data-[state=active]:text-brand-primary data-[state=active]:border-b-2 data-[state=active]:border-brand-primary transition-colors"
            >
              {p.persona}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        {personas.map((p) => (
          <Tabs.Content key={p.persona} value={p.persona}>
            <PersonaTakeaways takeaways={p.takeaways} />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </div>
  );
}
