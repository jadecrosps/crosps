function Dot() {
  return <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-ink" />;
}

export function Ticker({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-6">
          <span className="type-serif-lg whitespace-nowrap text-ink">{item}</span>
          <Dot />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-cream py-6">
      {/* Half the speed of the live site's ticker, which shares the animation. */}
      <div className="animate-ticker flex w-max" style={{ animationDuration: "60s" }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
