interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  return (
    <span className="inline-block rounded-full border border-crosps-charcoal/30 px-4 py-1.5 text-sm font-medium tracking-wide text-crosps-charcoal">
      {label}
    </span>
  );
}
