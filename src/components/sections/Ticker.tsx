import { BADGES } from "@/lib/constants";

function TickerItem({ text }: { text: string }) {
  return (
    <>
      <span className="font-serif text-[32px] leading-[1.2] text-crosps-charcoal whitespace-nowrap">
        {text}
      </span>
      <span className="size-[5px] rounded-full bg-crosps-charcoal shrink-0" />
    </>
  );
}

interface TickerProps {
  /** Single message to scroll (e.g. About page). When set, ignores BADGES. */
  message?: string;
}

export function Ticker({ message }: TickerProps) {
  const items = message ? [message] : BADGES;

  return (
    <section className="bg-crosps-purple-dust overflow-hidden py-6">
      <div className="flex animate-ticker items-center gap-6">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-center gap-6"
            aria-hidden={copy === 1}
          >
            {items.map((text) => (
              <TickerItem key={text} text={text} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
