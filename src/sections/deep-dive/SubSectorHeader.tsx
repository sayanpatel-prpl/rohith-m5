interface SubSectorHeaderProps {
  subSector: string;
}

export function SubSectorHeader({ subSector }: SubSectorHeaderProps) {
  return (
    <div className="bg-brand-primary/5 border border-brand-primary/20 rounded p-sm">
      <div className="text-sm font-semibold text-brand-primary">
        {subSector}
      </div>
      <div className="text-xs text-text-secondary">Monthly Deep Dive</div>
    </div>
  );
}
