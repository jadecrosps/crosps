"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ_ITEMS = [
  {
    question: "What are Crosps made of?",
    answer:
      "Crosps are made from just four ingredients: real vegetables (tomato, onion, or pepper depending on the flavour), olive oil, sea salt, and a touch of tapioca starch. No additives, no fillers — just simple, recognisable ingredients.",
  },
  {
    question: "Are your products vegan?",
    answer:
      "Yes. All Crosps flavours are 100% plant-based and vegan. We use only vegetables, oil, sea salt, and tapioca starch — no animal-derived ingredients.",
  },
  {
    question: "Can I order a single pack?",
    answer:
      "We're launching with multipacks for now. Sign up to our mailing list to be the first to hear when single packs and new formats become available.",
  },
  {
    question: "How are they so crunchy?",
    answer:
      "We use a gentle baking process that crisps the vegetables without excess oil. Lower heat helps preserve nutrients and flavour while still giving you that satisfying crunch you expect from a great crisp.",
  },
  {
    question: "What makes Crosps different from normal crisps?",
    answer:
      "Crosps start with real vegetables as the main ingredient — not potato or corn. We use up to 50% less oil, keep the good stuff (fibre, nutrients), and let the natural flavour of the veg lead. No artificial flavours or unnecessary additives.",
  },
  {
    question: "Can kids eat Crosps?",
    answer:
      "Crosps are made from simple, real ingredients and are a source of fibre. They're a snack the whole family can enjoy. As with any snack, we recommend them as part of a balanced diet.",
  },
  {
    question: "Where can I buy Crosps?",
    answer:
      "We're launching soon. Join our mailing list or follow us on social for stockist updates and where to find Crosps near you.",
  },
];

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-crosps-charcoal-15 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[16px] font-medium leading-[1.4] text-crosps-charcoal md:text-[18px]">
          {question}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center text-crosps-charcoal transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="2" x2="8" y2="14" />
            <line x1="2" y1="8" x2="14" y2="8" />
          </svg>
        </span>
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-10 text-[16px] leading-[1.6] text-crosps-charcoal-88">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
          {/* Left: title + subtitle */}
          <div>
            <h1 className="mb-4 font-serif text-[clamp(2.5rem,5vw,4rem)] italic leading-[1.1] text-crosps-charcoal">
              FAQ
            </h1>
            <p className="text-[16px] leading-[1.6] text-crosps-charcoal-88">
              Is there a question we haven&apos;t answered?{" "}
              <Link
                href="/contact"
                className="underline transition-colors hover:text-crosps-charcoal"
              >
                Contact us
              </Link>
            </p>
          </div>

          {/* Right: accordion */}
          <div>
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === index}
                onToggle={() =>
                  setOpenIndex((prev) => (prev === index ? null : index))
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
