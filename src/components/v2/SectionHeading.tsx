export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={`flex flex-col gap-2 ${align === "center" ? "items-center text-center" : "items-start"}`}>
      <h2 className="type-heading text-ink">{title}</h2>
      {subtitle && <p className="font-sans text-[18px] leading-[1.2] text-ink">{subtitle}</p>}
    </div>
  );
}

export function Divider() {
  return <hr className="w-full border-0 border-t border-ink-10" />;
}
