export function Tag({
  children,
  tone = "dark",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span
      className={`type-label inline-flex items-center px-3 py-1.5 ${
        tone === "dark" ? "bg-ink text-white/88" : "bg-stone text-ink"
      } ${className}`}
    >
      {children}
    </span>
  );
}
