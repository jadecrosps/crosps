import Image from "next/image";
import { REVIEWS } from "@/lib/v2-content";

function Stars({ className = "", width = 88 }: { className?: string; width?: number }) {
  return <Image src="/v2/stars.svg" alt="5 out of 5 stars" width={width} height={Math.round((width * 18) / 106)} className={className} />;
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
      {/* Reviews twice per half so the loop stays seamless on wide screens. */}
      {[...REVIEWS, ...REVIEWS].map((r, i) => (
        <li
          key={`${r.author}-${i}`}
          aria-hidden={i >= REVIEWS.length || undefined}
          className="flex min-h-[240px] w-[min(440px,82vw)] shrink-0 flex-col justify-between gap-8 border border-ink-10 bg-white p-6"
        >
          <div className="flex flex-col gap-3">
            {r.rating === 5 && <Stars />}
            <p className="font-sans text-[22px] leading-[1.15] text-ink">{r.title}</p>
            <p className="type-body text-ink-88">{r.body}</p>
          </div>
          <p className="type-mono text-ink">{r.author}</p>
        </li>
      ))}
    </ul>
  );

  return (
    <section id="reviews" aria-label="Reviews" className="flex scroll-mt-6 flex-col gap-10 bg-white py-16 md:py-20">
      <div className="gutter-x flex flex-col gap-2">
        {/* Stars on their own line above the heading. */}
        <Stars width={132} className="mb-3" />
        <p className="type-label text-ink-72">From our first tasters</p>
        <h2 className="type-heading text-ink">{title}</h2>
        <p className="type-body text-ink-72">{subtitle}</p>
      </div>
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <div className="animate-ticker flex w-max hover:[animation-play-state:paused] motion-reduce:animate-none" style={{ animationDuration: "140s" }}>
          {row(false)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
