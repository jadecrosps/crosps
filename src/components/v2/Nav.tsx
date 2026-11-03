"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./Button";
import { scrollToSection } from "./scrollToSection";
import { useCart } from "./cart/CartProvider";
import { V2_LINKS } from "@/lib/v2-content";

export type NavLinks = { shop: string; about: string; faq: string; home?: string; contact?: string; trade?: string };

const NO_LINKS: NavLinks = { shop: "#", about: "#", faq: "#" };

// Two-line menu icon (after lobie.com).
function MenuIcon() {
  return (
    <svg width="22" height="9" viewBox="0 0 22 9" fill="none" aria-hidden>
      <path d="M0 1h22M0 8h15" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

// Bag with the item count up to the right.
function BagIcon({ count }: { count: number }) {
  return (
    <span className="relative inline-flex">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M3.5 6.5h13l-1 11h-11l-1-11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M7 6.5V5a3 3 0 016 0v1.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span className="absolute -right-2.5 -top-2 font-sans text-[11px] leading-none">{count}</span>
    </span>
  );
}

// Menu items fade and rise into place when the menu opens.
const rise = (open: boolean) =>
  `transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
    open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
  }`;

export function Nav({
  tone = "light",
  cartCount = 0,
  links = NO_LINKS,
}: {
  tone?: "light" | "dark";
  cartCount?: number;
  links?: NavLinks;
}) {
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const count = cart ? cart.count : cartCount;
  const items = [
    { label: "Shop", href: links.shop },
    { label: "About", href: links.about },
    { label: "FAQ", href: links.faq },
  ];
  const mobileItems = [
    { label: "Home", href: links.home ?? "/" },
    ...items,
    { label: "Contact", href: links.contact ?? V2_LINKS.contact },
  ];
  const trade = links.trade ?? V2_LINKS.trade;
  const colour = tone === "light" ? "text-white" : "text-ink";

  // Full-screen menu: stop the page scrolling behind it, close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="gutter-x relative flex h-[84px] items-center justify-between">
      <div className="hidden items-center gap-[13px] md:flex">
        {items.map((i) => (
          <NavLink key={i.label} href={i.href} tone={tone}>
            {i.label}
          </NavLink>
        ))}
      </div>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className={`-ml-2 flex size-10 cursor-pointer items-center justify-center md:hidden ${colour}`}
      >
        <MenuIcon />
      </button>
      <Link href={links.home ?? "/"} aria-label="Crosps home" className="absolute left-1/2 -translate-x-1/2">
        <Image
          src={tone === "light" ? "/v2/crosps-logo-white.svg" : "/v2/crosps-logo-black.svg"}
          alt="Crosps"
          width={314}
          height={76}
          priority
          className="h-[25px] w-auto"
        />
      </Link>
      {cart ? (
        <button
          type="button"
          onClick={cart.open}
          aria-label={`Cart (${count})`}
          className={`cursor-pointer border-b border-transparent transition-colors md:px-2 md:pb-0.5 md:pt-2 md:hover:border-current ${colour}`}
        >
          <span className="md:hidden">
            <BagIcon count={count} />
          </span>
          <span className="type-nav hidden md:inline">Cart ({count})</span>
        </button>
      ) : (
        <NavLink href={links.shop} tone={tone}>
          Cart ({count})
        </NavLink>
      )}

      {/* Mobile menu (after lobie.com): full screen, links down the left, stockist call at the bottom.
          Always mounted so it can fade in and the links can rise in one after another. */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        inert={!open}
        className={`fixed inset-0 z-50 flex flex-col bg-paper text-ink transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="gutter-x relative flex h-[84px] shrink-0 items-center justify-between border-b border-ink-10">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="-ml-1 flex size-9 cursor-pointer items-center justify-center rounded-full border border-ink-10"
          >
            <CloseIcon />
          </button>
          <Link href={links.home ?? "/"} aria-label="Crosps home" onClick={() => setOpen(false)} className="absolute left-1/2 -translate-x-1/2">
            <Image src="/v2/crosps-logo-black.svg" alt="Crosps" width={314} height={76} loading="eager" className="h-[25px] w-auto" />
          </Link>
          {cart && (
            <button
              type="button"
              aria-label={`Cart (${count})`}
              onClick={() => {
                setOpen(false);
                cart.open();
              }}
              className="cursor-pointer"
            >
              <BagIcon count={count} />
            </button>
          )}
        </div>
        <ul className="gutter-x flex flex-col gap-1 pt-6">
          {mobileItems.map((i, n) => (
            <li key={i.label} className={rise(open)} style={{ transitionDelay: open ? `${120 + n * 50}ms` : "0ms" }}>
              <Link
                href={i.href}
                onClick={(e) => {
                  setOpen(false);
                  scrollToSection(e);
                }}
                className="block py-2 font-sans text-[20px] leading-[1.3]"
              >
                {i.label}
              </Link>
            </li>
          ))}
        </ul>
        <div
          className={`gutter-x mt-auto flex flex-col items-start gap-4 border-t border-ink-10 py-8 ${rise(open)}`}
          style={{ transitionDelay: open ? `${120 + mobileItems.length * 50}ms` : "0ms" }}
        >
          <Link
            href={trade}
            onClick={() => setOpen(false)}
            className="type-mono rounded-button bg-brown px-6 py-4 text-white transition-colors hover:bg-brown-88"
          >
            Become a stockist
          </Link>
          <p className="type-small text-ink-88">
            Already a stockist?{" "}
            <Link href={`${trade}#login`} onClick={() => setOpen(false)} className="underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </nav>
  );
}
