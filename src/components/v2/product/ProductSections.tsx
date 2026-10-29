import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Accordion } from "../Accordion";
import type { FaqGroup } from "../FaqDirectory";

// Product page sections laid out after pludolabs.com, in the Crosps design system.

// "Us vs. them" comparison: crisp types across the top, Crosps column highlighted.
export type ComparisonColumn = { name: string; values: string[]; highlight?: boolean; image?: string; imageAlt?: string };

export function Comparison({
  title,
  intro,
  rows,
  columns,
}: {
  title: React.ReactNode;
  intro: string;
  rows: string[];
  columns: ComparisonColumn[];
}) {
  const cols = `minmax(112px,1fr) repeat(${columns.length}, minmax(128px,1fr))`;
  return (
    <section className="gutter-x flex flex-col items-center gap-10 py-20 md:py-28">
      <div className="flex max-w-[560px] flex-col items-center gap-4 text-center">
        <p className="type-label text-ink-72">Us vs. them</p>
        <h2 className="type-heading text-ink">{title}</h2>
        <p className="type-body text-ink-88">{intro}</p>
      </div>
      {/* Scrolls sideways on small screens rather than squashing the columns. */}
      <div className="w-full max-w-[1200px] overflow-x-auto">
        <div role="table" aria-label="How Crosps compares" className="grid min-w-[624px]" style={{ gridTemplateColumns: cols }}>
          <div role="row" className="contents">
            <span role="columnheader" className="sticky left-0 z-10 bg-white" />
            {columns.map((c) => (
              <div
                key={c.name}
                role="columnheader"
                className={`flex flex-col items-center justify-end gap-3 px-3 pb-4 pt-6 text-center ${c.highlight ? "bg-cream" : ""}`}
              >
                {c.image && (
                  <div className="relative h-24 w-20">
                    <Image src={c.image} alt={c.imageAlt ?? ""} fill sizes="80px" className="object-contain" />
                  </div>
                )}
                <p className="type-mono text-ink">{c.name}</p>
              </div>
            ))}
          </div>
          {rows.map((label, r) => (
            <div role="row" key={label} className="contents">
              <p role="rowheader" className="type-mono sticky left-0 z-10 flex items-center border-t border-ink-10 bg-white py-5 pr-4 text-ink">
                {label}
              </p>
              {columns.map((c) => (
                <p
                  key={c.name}
                  role="cell"
                  className={`type-body flex items-center justify-center border-t border-ink-10 px-3 py-5 text-center ${
                    c.highlight ? "bg-cream text-ink" : "text-ink-72"
                  }`}
                >
                  {c.values[r]}
                </p>
              ))}
            </div>
          ))}
        </div>
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
