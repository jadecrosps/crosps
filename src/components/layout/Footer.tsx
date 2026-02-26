"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CrospsLogo } from "@/components/ui/CrospsLogo";
import { useSubscribe } from "@/hooks/useSubscribe";

const FOLLOW_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/eatcrosps/", external: true },
  { label: "Tiktok", href: "#", external: false },
  { label: "Contact", href: "mailto:jade@eatcrosps.com", external: true },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const { subscribe, isLoading, isSuccess, error } = useSubscribe();

  useEffect(() => {
    if (isSuccess) setEmail("");
  }, [isSuccess]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || isLoading) return;
    await subscribe(email);
  }

  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        {/* Top divider */}
        <div className="h-px w-full bg-crosps-charcoal-15" />

        {/* Main footer content */}
        <div className="flex flex-col gap-10 py-10 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          {/* Left: mailing list */}
          <div className="flex flex-col gap-6 lg:w-[343px] lg:shrink-0">
            <p className="font-serif text-[32px] leading-[1.2] text-crosps-charcoal">
              Join our mailing list before your friends do.
            </p>
            <div>
              <form onSubmit={handleSubmit} className="flex h-[50px] items-center justify-between border border-crosps-charcoal-15 px-6 py-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full bg-transparent text-[16px] leading-[1.5] text-crosps-charcoal placeholder:text-crosps-charcoal/50 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  disabled={isLoading}
                  className="shrink-0 cursor-pointer opacity-50 disabled:opacity-20"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="8" x2="13" y2="8" />
                    <polyline points="9 4 13 8 9 12" />
                  </svg>
                </button>
              </form>
              {isSuccess && (
                <p className="mt-2 text-[14px] text-crosps-charcoal">
                  You&apos;re in! We&apos;ll be in touch.
                </p>
              )}
              {error && (
                <p className="mt-2 text-[14px] text-red-600">
                  {error}
                </p>
              )}
            </div>
          </div>

          {/* Vertical divider (desktop) */}
          <div className="hidden h-auto self-stretch lg:block">
            <div className="mx-14 h-full w-px bg-crosps-charcoal-15" />
          </div>

          {/* Horizontal divider (mobile) */}
          <div className="h-px w-full bg-crosps-charcoal-15 lg:hidden" />

          {/* Right: Follow links */}
          <div className="flex w-[213px] flex-col gap-6">
            <p className="px-3 py-2 text-[14px] leading-[1.2] text-crosps-charcoal">
              FOLLOW
            </p>
            <div className="flex flex-col gap-3">
              {FOLLOW_LINKS.map((link) =>
                link.external ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-[16px] leading-[1.5] text-crosps-charcoal transition-colors hover:text-crosps-charcoal-72"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="px-3 py-2 text-[16px] leading-[1.5] text-crosps-charcoal transition-colors hover:text-crosps-charcoal-72"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bottom divider */}
        <div className="h-px w-full bg-crosps-charcoal-15" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between py-8">
          <Link href="/" aria-label="Crosps home">
            <CrospsLogo className="h-8 w-auto text-crosps-charcoal" />
          </Link>
          <p className="text-[14px] leading-[1.2] text-crosps-charcoal-72">
            Copyright &copy;{new Date().getFullYear()} Crosps. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
