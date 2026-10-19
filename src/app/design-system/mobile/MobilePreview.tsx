"use client";

import { useState } from "react";
import Link from "next/link";

const DEVICES = [
  { name: "iPhone SE", w: 375, h: 667 },
  { name: "iPhone 15", w: 393, h: 852 },
  { name: "iPhone 15 Pro Max", w: 430, h: 932 },
];

const PAGES = [
  { name: "Design system", src: "/design-system" },
  { name: "Contact page", src: "/design-system/contact" },
];

// Shows the design system pages inside a phone-sized frame for reviewing on desktop.
export function MobilePreview() {
  const [device, setDevice] = useState(DEVICES[1]);
  const [page, setPage] = useState(PAGES[0]);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-cream px-5 py-8 text-ink">
      <div className="flex w-full max-w-[900px] flex-col gap-4">
        <Link href="/design-system" className="type-small text-ink-72 underline underline-offset-4">
          Back to the design system
        </Link>
        <h1 className="type-heading">Mobile preview</h1>
        <p className="type-body text-ink-72">
          The same pages at phone width. Scroll inside the frame. For touch behaviour, open the preview link on your phone.
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="type-label text-ink-50">Page</span>
            {PAGES.map((p) => (
              <button
                key={p.src}
                type="button"
                onClick={() => setPage(p)}
                className={`type-small cursor-pointer border px-3 py-1.5 ${page.src === p.src ? "border-ink bg-ink text-white" : "border-ink-10 bg-white hover:border-ink-50"}`}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="type-label text-ink-50">Phone</span>
            {DEVICES.map((d) => (
              <button
                key={d.name}
                type="button"
                onClick={() => setDevice(d)}
                className={`type-small cursor-pointer border px-3 py-1.5 ${device.name === d.name ? "border-ink bg-ink text-white" : "border-ink-10 bg-white hover:border-ink-50"}`}
              >
                {d.name} · {d.w}px
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="rounded-[44px] bg-ink p-3 shadow-xl">
          <iframe
            key={page.src}
            src={page.src}
            title={`${page.name} at ${device.w}px`}
            width={device.w}
            height={device.h}
            className="block rounded-[32px] bg-white"
          />
        </div>
      </div>
    </div>
  );
}
