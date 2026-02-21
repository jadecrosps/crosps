"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CrospsLogo } from "@/components/ui/CrospsLogo";

const SCROLL_THRESHOLD = 32;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll();
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
        <p className="text-xs font-medium tracking-wide text-crosps-charcoal uppercase">
          Snacking Re-Defined. Be The First To Try Crosps
        </p>
      </div>

      {/* Main navbar — logo only */}
      <nav className="bg-white">
        <div className="flex items-center justify-center px-4 py-5">
          <Link href="/" aria-label="Crosps home">
            <CrospsLogo className="h-8 w-auto text-crosps-charcoal" />
          </Link>
        </div>
      </nav>
      </div>
    </header>
  );
}
