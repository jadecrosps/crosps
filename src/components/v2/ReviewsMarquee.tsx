import Image from "next/image";
import { REVIEWS } from "@/lib/v2-content";

function Stars({ className = "" }: { className?: string }) {
  return <Image src="/v2/stars.svg" alt="5 out of 5 stars" width={88} height={15} className={className} />;
}

// Reviews band after pludolabs.com: header on the left, cards scrolling slowly across.
// Pauses on hover; stays still (and scrolls by hand) for reduced-motion users.
export function ReviewsMarquee({
  title = "Worth talking about.",
  subtitle = "A few thoughts from people who thought so too.",
}: {
  title?: string;
  subtitle?: string;
}) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {REVIEWS.map((r) => (
        <li key={r.author} className="flex min-h-[240px] w-[min(440px,82vw)] shrink-0 flex-col justify-between gap-8 bg-white p-6">
          <div className="flex flex-col gap-3">
            <p className="font-sans text-[22px] leading-[1.15] text-ink">{r.title}</p>
            <p className="type-body text-ink-88">{r.body}</p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="type-mono text-ink">{r.author}</p>
            {r.rating === 5 && <Stars />}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Reviews" className="flex flex-col gap-10 bg-cream py-16 md:py-20">
      <div className="gutter-x flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Stars />
          <p className="type-label text-ink">From our first tasters</p>
        </div>
        <h2 className="type-heading text-ink">{title}</h2>
        <p className="type-body text-ink-72">{subtitle}</p>
      </div>
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div className="animate-ticker flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none" style={{ animationDuration: "70s" }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
