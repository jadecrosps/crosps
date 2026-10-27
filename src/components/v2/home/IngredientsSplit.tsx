"use client";

import { useState } from "react";
import Image from "next/image";

export type IngredientSlide = { title: string; body: string; image: string; alt: string; overlay?: string };

// Split section: photo on the left, cream card with slides on the right (More Mud layout).
export function IngredientsSplit({ eyebrow, slides }: { eyebrow: string; slides: IngredientSlide[] }) {
  const [i, setI] = useState(0);
  const slide = slides[i];

  return (
    <section className="gutter-x grid gap-2 py-20 md:grid-cols-2 md:py-28">
      <div className="relative aspect-square overflow-hidden bg-paper md:aspect-auto md:min-h-[560px]">
        {slides.map((s, n) => (
          <div key={s.image} className={`absolute inset-0 transition-opacity duration-500 ${n === i ? "opacity-100" : "opacity-0"}`} aria-hidden={n !== i}>
            <Image src={s.image} alt={s.alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
            {s.overlay && <div className="absolute inset-0" style={{ background: s.overlay }} />}
          </div>
        ))}
      </div>
      <div className="flex flex-col justify-between gap-10 bg-cream p-8 md:min-h-[560px] md:p-12">
        <p className="type-label text-ink">{eyebrow}</p>
        <div className="flex max-w-[460px] flex-col gap-5" aria-live="polite">
          <h2 className="type-statement text-ink">{slide.title}</h2>
          <p className="type-body text-ink-88">{slide.body}</p>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="flex gap-2" role="tablist" aria-label="Ingredients">
            {slides.map((s, n) => (
              <button
                key={s.title}
                type="button"
                role="tab"
                aria-selected={n === i}
                aria-label={s.title}
                onClick={() => setI(n)}
                className={`size-2 cursor-pointer rounded-full transition-colors ${n === i ? "bg-ink" : "bg-ink-10 hover:bg-ink-50"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Previous ingredient"
              onClick={() => setI((n) => (n - 1 + slides.length) % slides.length)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-ink-10 text-ink transition-colors hover:border-ink"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next ingredient"
              onClick={() => setI((n) => (n + 1) % slides.length)}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-ink-10 text-ink transition-colors hover:border-ink"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
