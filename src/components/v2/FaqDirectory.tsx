"use client";

import { useEffect, useId, useMemo, useState } from "react";
import Link from "next/link";
import { TextLink } from "./Button";

export type FaqGroup = { id: string; title: string; items: { question: string; answer: string }[] };

function PlusMinus({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative flex size-6 shrink-0 items-center justify-center">
      <span className="relative size-2.5">
        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
        <span
          className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ${
            open ? "scale-y-0" : "scale-y-100"
          }`}
        />
      </span>
    </span>
  );
}

function FaqItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="border-b border-ink-10">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className={`flex w-full cursor-pointer items-center justify-between gap-6 py-4 text-left font-sans text-[18px] leading-[1.3] transition-colors ${
            open ? "text-ink-72" : "text-ink hover:text-ink-72"
          }`}
        >
          {question}
          <PlusMinus open={open} />
        </button>
      </h3>
      <div
        id={id}
        role="region"
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <p className="type-body max-w-[640px] pb-6 text-ink-88">{answer}</p>
        </div>
      </div>
    </div>
  );
}

// Searchable FAQ: sticky search + large category nav on the left (after moremud.co), every group listed on the right.
export function FaqDirectory({
  groups,
  searchPlaceholder = "Try “What are Crosps made of?”",
  contactHref = "/contact",
}: {
  groups: FaqGroup[];
  searchPlaceholder?: string;
  contactHref?: string;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(groups[0]?.id);
  const searchId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)),
      }))
      .filter((g) => g.items.length > 0);
  }, [groups, query]);

  // Highlight the last group whose heading has passed the top third of the screen.
  useEffect(() => {
    const update = () => {
      let current = filtered[0]?.id;
      for (const g of filtered) {
        const el = document.getElementById(`faq-${g.id}`);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.33) current = g.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [filtered]);

  return (
    <div className="flex flex-col gap-10 lg:flex-row lg:gap-0">
      <aside className="lg:w-[360px] lg:shrink-0 lg:pr-10">
        <div className="flex flex-col gap-8 lg:sticky lg:top-8">
          <div>
            <label htmlFor={searchId} className="sr-only">
              Search FAQs
            </label>
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="type-body w-full border-b border-ink bg-transparent pb-2 text-ink placeholder:text-ink-50 outline-none"
            />
          </div>
          <nav aria-label="FAQ categories" className="-mx-5 overflow-x-auto px-5 lg:mx-0 lg:overflow-visible lg:px-0">
            <ul className="flex gap-5 lg:flex-col lg:gap-4">
              {groups.map((g) => {
                const available = filtered.some((f) => f.id === g.id);
                return (
                  <li key={g.id} className="shrink-0">
                    <a
                      href={`#faq-${g.id}`}
                      aria-current={active === g.id ? "true" : undefined}
                      className={`type-small whitespace-nowrap transition-colors lg:font-sans lg:text-[20px] lg:leading-[1.2] ${
                        !available ? "pointer-events-none text-ink-10" : active === g.id ? "text-ink" : "text-ink-50 hover:text-ink"
                      }`}
                    >
                      {g.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-4 border-t border-ink-10 pt-8">
            <TextLink href={contactHref} underline={false}>
              Ask us a question
            </TextLink>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col gap-14">
        {filtered.length === 0 && (
          <p className="type-body text-ink-72">
            No answers for “{query}”.{" "}
            <Link href={contactHref} className="text-ink underline underline-offset-4">
              Ask us directly
            </Link>
            .
          </p>
        )}
        {filtered.map((g, gi) => (
          <section key={g.id} id={`faq-${g.id}`} className="scroll-mt-8">
            <h2 className="type-heading mb-4 flex items-start gap-1.5 text-ink">
              {g.title}
              <span className="type-label text-ink-50">{g.items.length}</span>
            </h2>
            <div>
              {g.items.map((item, i) => (
                <FaqItem key={item.question} {...item} defaultOpen={!query && gi === 0 && i === 0} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
