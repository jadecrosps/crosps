"use client";

import { useId, useState } from "react";

// Simple +/− accordion row (product details).
export function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b border-ink-10">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between py-5 text-left font-sans text-[20px] leading-[1.3] text-ink"
      >
        {title}
        <span aria-hidden className="relative size-3 shrink-0">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ${open ? "scale-y-0" : ""}`} />
        </span>
      </button>
      <div id={id} role="region" className={`grid transition-[grid-template-rows] duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="type-body pb-6 text-ink-88">{children}</div>
        </div>
      </div>
    </div>
  );
}
