"use client";

import { useState } from "react";
import Image from "next/image";
import { Tag } from "../Tag";

type Slide = { src: string; alt: string; contain?: boolean };

// Lobie-style gallery: large image with arrows, thumbnail column beside it (row underneath on phones).
export function ProductGallery({ slides, tag }: { slides: Slide[]; tag?: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((n) => (n + d + slides.length) % slides.length);
  const current = slides[i];

  return (
    <div className="flex flex-col gap-2 md:flex-row">
      <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-paper">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={i === 0}
          sizes="(max-width: 768px) 100vw, 45vw"
          className={current.contain ? "object-contain p-[12%]" : "object-cover"}
        />
        {tag && (
          <div className="absolute left-6 top-6">
            <Tag tone="light">{tag}</Tag>
          </div>
        )}
        {slides.length > 1 && (
          <>
            <button type="button" aria-label="Previous image" onClick={() => go(-1)} className="absolute left-4 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink transition-colors hover:bg-white">
              ←
            </button>
            <button type="button" aria-label="Next image" onClick={() => go(1)} className="absolute right-4 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink transition-colors hover:bg-white">
              →
            </button>
          </>
        )}
      </div>
      <div className="flex gap-2 overflow-x-auto md:w-[120px] md:flex-col md:overflow-visible lg:w-[160px]">
        {slides.map((s, n) => (
          <button
            key={s.src}
            type="button"
            aria-label={`Show image ${n + 1}`}
            aria-current={n === i}
            onClick={() => setI(n)}
            className={`relative aspect-[4/5] w-20 shrink-0 cursor-pointer overflow-hidden bg-paper transition-opacity md:w-full ${n === i ? "" : "opacity-50 hover:opacity-80"}`}
          >
            <Image src={s.src} alt="" fill sizes="160px" className={s.contain ? "object-contain p-2" : "object-cover"} />
          </button>
        ))}
      </div>
    </div>
  );
}
