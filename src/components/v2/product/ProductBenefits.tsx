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

// Back-of-pack nutrition table.
export function NutritionTable({ rows }: { rows: NutritionRow[] }) {
  return (
    <table className="type-small w-full">
      <thead>
        <tr className="border-b border-ink-10 text-left text-ink-72">
          <th className="py-2 font-normal">Typical values</th>
          <th className="py-2 text-right font-normal">Per 100g</th>
          <th className="py-2 text-right font-normal">Per 15g serving</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-b border-ink-10">
            <th scope="row" className={`py-2 text-left font-normal ${r.sub ? "pl-3 text-ink-72" : ""}`}>
              {r.label}
            </th>
            <td className="py-2 text-right">{r.per100}</td>
            <td className="py-2 text-right">{r.perServing}</td>
          </tr>
        ))}
      </tbody>
      <caption className="caption-bottom pt-2 text-left text-ink-50">Contains 2 servings. Contains naturally occurring sugars.</caption>
    </table>
  );
}
