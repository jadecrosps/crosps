import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Accordion } from "../Accordion";
import type { FaqGroup } from "../FaqDirectory";

// Product page sections laid out after pludolabs.com, in the Crosps design system.

type Card = { image: string; alt: string; title: string; body: string };

// Centred intro with three photo cards ("Why people love…").
export function FeatureCards({ title, intro, cards }: { title: React.ReactNode; intro: string; cards: Card[] }) {
  return (
    <section className="gutter-x flex flex-col items-center gap-10 bg-cream py-20 md:py-28">
      <div className="flex max-w-[640px] flex-col items-center gap-4 text-center">
        <h2 className="type-heading text-ink">{title}</h2>
        <p className="type-body text-ink-88">{intro}</p>
      </div>
      <div className="grid w-full max-w-[1200px] gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <div key={c.title} className="flex flex-col bg-white">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image src={c.image} alt={c.alt} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" />
            </div>
            <div className="flex flex-col gap-2 p-6">
              <p className="font-sans text-[22px] leading-[1.15] text-ink">{c.title}</p>
              <p className="type-body text-ink-72">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Mark({ yes }: { yes: boolean }) {
  return yes ? (
    <span aria-label="Yes" className="flex size-6 items-center justify-center rounded-full border border-ink text-[12px] text-ink">
      ✓
    </span>
  ) : (
    <span aria-label="No" className="text-[16px] text-ink-50">
      ×
    </span>
  );
}

// "Us vs. them" comparison table.
export function Comparison({
  title,
  intro,
  pack,
  packAlt,
  rows,
}: {
  title: React.ReactNode;
  intro: string;
  pack: string;
  packAlt: string;
  rows: { label: string; us: boolean; them: boolean }[];
}) {
  return (
    <section className="gutter-x flex flex-col items-center gap-10 py-20 md:py-28">
      <div className="flex max-w-[560px] flex-col items-center gap-4 text-center">
        <p className="type-label text-ink-72">Us vs. them</p>
        <h2 className="type-heading text-ink">{title}</h2>
        <p className="type-body text-ink-88">{intro}</p>
      </div>
      <div className="w-full max-w-[760px]">
        <div className="grid grid-cols-[minmax(0,1fr)_96px_96px] items-end md:grid-cols-[minmax(0,1fr)_140px_140px]">
          <span />
          <div className="flex flex-col items-center gap-2 bg-cream px-2 pt-4 pb-3">
            <div className="relative h-20 w-16">
              <Image src={pack} alt={packAlt} fill sizes="64px" className="object-contain" />
            </div>
            <p className="type-mono text-ink">Crosps</p>
          </div>
          <p className="type-mono pb-3 text-center text-ink-72">Typical crisp</p>
        </div>
        {rows.map((r, n) => (
          <div key={r.label} className="grid grid-cols-[minmax(0,1fr)_96px_96px] items-stretch md:grid-cols-[minmax(0,1fr)_140px_140px]">
            <p className="type-body border-t border-ink-10 py-4 pr-4 text-ink">{r.label}</p>
            <div className={`flex items-center justify-center border-t border-ink-10 bg-cream ${n === rows.length - 1 ? "pb-1" : ""}`}>
              <Mark yes={r.us} />
            </div>
            <div className="flex items-center justify-center border-t border-ink-10">
              <Mark yes={r.them} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Half photo, half text, edge to edge. `flip` puts the photo on the right.
export function SplitFeature({
  image,
  alt = "",
  media,
  flip = false,
  tone = "white",
  children,
}: {
  image?: string;
  alt?: string;
  media?: React.ReactNode; // in place of a single photo
  flip?: boolean;
  tone?: "white" | "cream";
  children: React.ReactNode;
}) {
  return (
    <section className={`grid md:grid-cols-2 ${tone === "cream" ? "bg-cream" : "bg-white"}`}>
      <div className={`relative aspect-square w-full md:aspect-auto md:min-h-[640px] ${flip ? "md:order-last" : ""}`}>
        {media ?? (image && <Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />)}
      </div>
      <div className="flex items-center px-5 py-16 md:px-16 md:py-20 xl:px-24">
        <div className="flex max-w-[480px] flex-col gap-6">{children}</div>
      </div>
    </section>
  );
}

// Ingredient checklist for a SplitFeature.
export function IngredientChecklist({ items }: { items: { name: string; note: string }[] }) {
  return (
    <ul className="flex flex-col gap-3">
      {items.map((i) => (
        <li key={i.name} className="type-body flex items-start gap-3 text-ink-88">
          <span aria-hidden className="mt-[2px] flex size-5 shrink-0 items-center justify-center rounded-full border border-ink text-[10px] text-ink">
            ✓
          </span>
          <span>
            <span className="text-ink">{i.name}</span>, {i.note}
          </span>
        </li>
      ))}
    </ul>
  );
}

// Dark FAQ band: photo on the left, questions on the right.
export function FaqBand({ groups, image, alt, href }: { groups: FaqGroup[]; image: string; alt: string; href: string }) {
  const items = groups.flatMap((g) => g.items);
  return (
    <section className="gutter-x flex flex-col gap-12 bg-brown py-20 text-white md:py-28">
      <h2 className="type-heading text-center">
        Questions, <SerifAccent>answered.</SerifAccent>
      </h2>
      <div className="mx-auto grid w-full max-w-[1200px] items-start gap-10 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-20">
        <div className="relative aspect-[4/5] w-full">
          <Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
        </div>
        <div className="flex flex-col gap-8">
          <div className="border-t border-white/20">
            {items.map((q) => (
              <Accordion key={q.question} title={q.question} tone="dark">
                {q.answer}
              </Accordion>
            ))}
          </div>
          <a
            href={href}
            className="type-label self-start rounded-button border border-white px-4 py-2 text-white transition-colors hover:bg-white hover:text-ink"
          >
            All FAQs →
          </a>
        </div>
      </div>
    </section>
  );
}
