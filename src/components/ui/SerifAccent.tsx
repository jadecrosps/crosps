interface SerifAccentProps {
  children: React.ReactNode;
  className?: string;
}

export function SerifAccent({ children, className = "" }: SerifAccentProps) {
  return <em className={`font-serif italic ${className}`}>{children}</em>;
}
