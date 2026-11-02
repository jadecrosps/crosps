function Dot() {
  return <span aria-hidden className="size-[5px] shrink-0 rounded-full bg-ink" />;
}

export function Ticker({ items }: { items: string[] }) {
  // Each half repeats the list three times so it is always wider than the screen,
  // which keeps the loop seamless on wide displays.
  const loop = [...items, ...items, ...items];
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center gap-6 pr-6" aria-hidden={hidden || undefined}>
      {loop.map((item, i) => (
        <span key={`${item}-${i}`} className="flex items-center gap-6">
          <span className="type-serif-lg whitespace-nowrap text-ink">{item}</span>
          <Dot />
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden bg-cream py-6">
      {/* Half the speed of the live site's ticker (three times the distance, three times the time). */}
      <div className="animate-ticker flex w-max" style={{ animationDuration: "180s" }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
