"use client";

import { useState } from "react";
import type { NutritionRow, Stat } from "@/lib/v2-content";

// Three benefit lines plus a row of stat tiles.
export function ProductBenefits({ benefits, stats }: { benefits: string[]; stats: Stat[] }) {
  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-3">
        {benefits.map((b) => (
          <li key={b} className="type-body-lg flex items-start gap-3 text-ink">
            <span aria-hidden className="mt-[0.6em] size-2 shrink-0 rounded-full bg-ink" />
            {b}
          </li>
        ))}
      </ul>
      <dl className="grid grid-cols-3 gap-2 sm:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center justify-center gap-1 rounded-[4px] bg-cream px-2 py-4 text-center">
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-sans text-[24px] leading-none text-ink">
              {s.value}
              {s.unit && <span className="text-[14px]">{s.unit}</span>}
            </dd>
            <dd aria-hidden className="type-small text-ink-72">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// Nutrition as a simple list: per 100g by default, with a switch to per serving.
export function NutritionTable({ rows }: { rows: NutritionRow[] }) {
  const [perServing, setPerServing] = useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Show nutrition" className="flex gap-2">
        {[
          ["Per 100g", false],
          ["Per 15g serving", true],
        ].map(([label, value]) => (
          <button
            key={String(label)}
            type="button"
            aria-pressed={perServing === value}
            onClick={() => setPerServing(value as boolean)}
            className={`type-label cursor-pointer rounded-button border px-3 py-1.5 transition-colors ${
              perServing === value ? "border-brown bg-brown text-white" : "border-ink-10 text-ink-72 hover:border-ink-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <dl className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.label} className={`type-body flex items-baseline gap-2 ${r.sub ? "pl-4 text-ink-72" : "text-ink"}`}>
            <dt>{r.label}</dt>
            <span aria-hidden className="flex-1 border-b border-dotted border-ink-50" />
            <dd>{perServing ? r.perServing : r.per100}</dd>
          </div>
        ))}
      </dl>
      <p className="type-small text-ink-50">Each 30g bag contains 2 servings. Contains naturally occurring sugars.</p>
    </div>
  );
}
