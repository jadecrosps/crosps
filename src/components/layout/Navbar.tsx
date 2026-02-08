"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CrospsLogo } from "@/components/ui/CrospsLogo";

const SCROLL_THRESHOLD = 32;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll(); // run once for SSR / initial scroll position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`flex flex-col transition-all duration-300 ease-out ${
          isScrolled
            ? "mx-0 w-full max-w-none gap-0 px-0 py-0"
            : "mx-auto max-w-[1440px] gap-3 px-5 py-4 md:px-10"
        }`}
      >
      {/* Green announcement banner */}
      <div className="bg-crosps-green text-center py-2.5 px-6 md:px-10">
        <p className="text-xs font-medium tracking-wide text-white uppercase">
          Snacking re-defined. Be the first to try Crosps
        </p>
      </div>

      {/* Main navbar */}
      <nav className="bg-white">
        <div className="px-4 py-5">
          <div className="relative flex items-center justify-between">
            {/* Left: Shop, About only (desktop) */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/#products"
                className="text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                Shop
              </Link>
              <Link
                href="/about"
                className="text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                About
              </Link>
            </div>

            {/* Left: hamburger (mobile) */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 text-crosps-charcoal md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="8" x2="20" y2="8" />
                  <line x1="4" y1="16" x2="20" y2="16" />
                </svg>
              )}
            </button>

            {/* Center: logo */}
            <Link
              href="/"
              aria-label="Crosps home"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <CrospsLogo className="h-8 w-auto text-crosps-charcoal" />
            </Link>

            {/* Right: ACCOUNT & CART (desktop) */}
            <div className="hidden items-center gap-8 md:flex">
              <Link
                href="/account"
                className="text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                Account
              </Link>
              <Link
                href="/cart"
                className="text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                Cart
              </Link>
            </div>

            {/* Right: cart icon (mobile) */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="p-2 text-crosps-charcoal md:hidden"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="border-t border-crosps-gray-light bg-white md:hidden">
            <div className="space-y-1 px-6 py-4">
              <Link
                href="/#products"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                Shop
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                About
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                Account
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-xs font-semibold uppercase tracking-widest text-crosps-charcoal transition-colors duration-200 hover:text-crosps-green"
              >
                Cart
              </Link>
            </div>
          </div>
        )}
      </nav>
      </div>
    </header>
  );
}
