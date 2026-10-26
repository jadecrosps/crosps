"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { NavLink } from "./Button";
import { useCart } from "./cart/CartProvider";

export type NavLinks = { shop: string; about: string; faq: string; home?: string };

const NO_LINKS: NavLinks = { shop: "#", about: "#", faq: "#" };

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
  const items = [
    { label: "Shop", href: links.shop },
    { label: "About", href: links.about },
    { label: "FAQ", href: links.faq },
  ];

  return (
    <nav className="gutter-x relative flex h-[84px] items-center justify-between">
      <div className="hidden items-center gap-[13px] md:flex">
        {items.map((i) => (
          <NavLink key={i.label} href={i.href} tone={tone}>
            {i.label}
          </NavLink>
        ))}
      </div>
      {/* Mobile menu (no mobile designs yet: proposal) */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className={`type-nav cursor-pointer px-2 pb-0.5 pt-2 md:hidden ${tone === "light" ? "text-white" : "text-ink"}`}
      >
        {open ? "Close" : "Menu"}
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
          className={`type-nav cursor-pointer border-b border-transparent px-2 pb-0.5 pt-2 transition-colors hover:border-current ${tone === "light" ? "text-white" : "text-ink"}`}
        >
          Cart ({cart.count})
        </button>
      ) : (
        <NavLink href={links.shop} tone={tone}>
          Cart ({cartCount})
        </NavLink>
      )}
      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full z-20 flex flex-col gap-1 bg-white px-5 py-6 shadow-sm md:hidden">
          {items.map((i) => (
            <Link key={i.label} href={i.href} onClick={() => setOpen(false)} className="type-heading py-2 text-ink">
              {i.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
