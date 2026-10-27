import Image from "next/image";
import type { Stat } from "@/lib/v2-content";

// Dark benefits card: photo in the middle, pack-sourced stats either side (moremud.co layout).
export function BenefitsBlock({ title, image, alt, stats }: { title: React.ReactNode; image: string; alt: string; stats: Stat[] }) {
  const left = stats.slice(0, 2);
  const right = stats.slice(2, 4);
  const Item = ({ s }: { s: Stat }) => (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="font-sans text-[44px] leading-none text-white md:text-[56px]">
        {s.value}
        {s.unit && <span className="text-[20px] md:text-[24px]">{s.unit}</span>}
      </p>
      <p className="type-label text-white/72">{s.label}</p>
    </div>
  );
  return (
    <section className="gutter-x">
      <div className="flex flex-col items-center gap-12 bg-ink px-6 py-16 md:px-12 md:py-20">
        <h2 className="type-heading text-center text-white">{title}</h2>
        <div className="grid w-full items-center gap-12 md:grid-cols-[1fr_minmax(0,420px)_1fr]">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-1 md:gap-16">
            {left.map((s) => (
              <Item key={s.label} s={s} />
            ))}
          </div>
          <div className="relative order-first aspect-[4/5] w-full md:order-none">
            <Image src={image} alt={alt} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
          </div>
          <div className="grid grid-cols-2 gap-10 md:grid-cols-1 md:gap-16">
            {right.map((s) => (
              <Item key={s.label} s={s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
