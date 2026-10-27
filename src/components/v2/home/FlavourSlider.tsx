"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, V2_LINKS } from "@/lib/v2-content";

const COLOURS: Record<string, string> = {
  tomato: "var(--color-tomato)",
  onion: "var(--color-onion)",
  pepper: "var(--color-pepper)",
};

function price(p: string) {
  const [amount, currency] = p.split(" ");
  return new Intl.NumberFormat("en-GB", { style: "currency", currency }).format(Number(amount));
}

// Flavour slider (after pludolabs.com): pack on a flavour-coloured panel, lifestyle photo beside it.
export function FlavourSlider() {
  const [i, setI] = useState(0);
  const p = PRODUCTS[i];
  const go = (d: number) => setI((n) => (n + d + PRODUCTS.length) % PRODUCTS.length);

  return (
    <section aria-label="Flavours" className="grid md:grid-cols-2">
      <div
        className="relative flex min-h-[560px] flex-col items-center justify-center gap-8 px-6 py-16 text-white transition-colors duration-500 md:min-h-[760px]"
        style={{ backgroundColor: COLOURS[p.slug] }}
      >
        <Link href={V2_LINKS.product(p.slug)} className="relative aspect-square w-[min(420px,75vw)]">
          <Image key={p.image} src={p.image} alt={`${p.name} pack`} fill sizes="420px" className="fade-in object-contain" />
        </Link>
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="type-mono">{p.name}</p>
          <p className="type-body text-white/88">{p.descriptor}</p>
          <p className="type-mono">{price(p.price)}</p>
        </div>
        <Link
          href={V2_LINKS.product(p.slug)}
          className="type-mono rounded-button border border-white px-10 py-4 transition-colors hover:bg-white hover:text-ink"
        >
          Shop {p.name.split(" ")[0]}
        </Link>
        <div className="absolute inset-x-0 bottom-6 flex items-center justify-center gap-6">
          <button type="button" aria-label="Previous flavour" onClick={() => go(-1)} className="cursor-pointer px-2 hover:opacity-70">
            ←
          </button>
          <div className="flex gap-2">
            {PRODUCTS.map((x, n) => (
              <button
                key={x.slug}
                type="button"
                aria-label={`Show ${x.name}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className={`size-2 cursor-pointer rounded-full bg-white transition-opacity ${n === i ? "" : "opacity-40"}`}
              />
            ))}
          </div>
          <button type="button" aria-label="Next flavour" onClick={() => go(1)} className="cursor-pointer px-2 hover:opacity-70">
            →
          </button>
        </div>
      </div>
      <div className="relative aspect-[4/5] w-full md:aspect-auto">
        <Image key={p.hoverImage} src={p.hoverImage} alt={`${p.name} out and about`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>
    </section>
  );
}
