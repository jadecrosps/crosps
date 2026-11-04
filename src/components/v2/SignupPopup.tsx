"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { EmailCapture } from "./EmailCapture";
import { useCart } from "./cart/CartProvider";

// Early-access popup in the Crosps design system, replacing Klaviyo's own popup on V2.
// Sign-ups go to the same Klaviyo list as the footer form.
// When it opens: on desktop after 5 seconds, or earlier if the visitor heads for the top of the
// window to leave; on phones once they've scrolled 40% of the page. Never over the cart, or on
// trade, contact and policy pages. At most once a day; never again once they've signed up.

const DISMISSED = "crosps_signup_dismissed"; // "subscribed", or when it last opened (ms)
const DELAY_MS = 5000;
const SCROLL_DEPTH = 0.4;
const SNOOZE_MS = 24 * 60 * 60 * 1000;
const SKIP_PAGES = ["/trade", "/contact", "/policies"];

function hidden() {
  try {
    const v = localStorage.getItem(DISMISSED);
    if (v === "subscribed") return true;
    const shownAt = Number(v);
    return shownAt > 0 && Date.now() - shownAt < SNOOZE_MS;
  } catch {
    return false;
  }
}

function remember(value: string) {
  try {
    localStorage.setItem(DISMISSED, value);
  } catch {}
}

export function SignupPopup() {
  const [open, setOpen] = useState(false);
  const cartOpen = useCart()?.isOpen ?? false;
  const pathname = usePathname();
  const skipPage = SKIP_PAGES.some((p) => pathname.startsWith(p));
  // Read inside the triggers, so opening the cart or changing page doesn't restart them.
  const blocked = useRef(false);
  useEffect(() => {
    blocked.current = cartOpen || skipPage;
  }, [cartOpen, skipPage]);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (hidden()) return;
    let done = false;
    const show = () => {
      if (done || blocked.current || hidden()) return;
      done = true;
      remember(String(Date.now()));
      setOpen(true);
      cleanup();
    };

    const phone = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= SCROLL_DEPTH) show();
    };
    // Exit intent: the pointer leaves through the top of the window, towards the tabs and address bar.
    const onLeave = (e: MouseEvent) => {
      if (!e.relatedTarget && e.clientY <= 0) show();
    };
    // Desktop: from 5 seconds in, check each second, so a cart that's open at that moment only postpones it.
    const start = Date.now();
    const timer = phone ? undefined : setInterval(() => Date.now() - start >= DELAY_MS && show(), 1000);
    if (phone) window.addEventListener("scroll", onScroll, { passive: true });
    else document.addEventListener("mouseout", onLeave);

    function cleanup() {
      clearInterval(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    }
    return cleanup;
  }, []);

  // Klaviyo's script locks page scroll when its own popup opens; that popup is hidden on V2 (below).
  useEffect(() => {
    // Only touch the class when present: classList.remove always rewrites the attribute,
    // which would retrigger the observer forever.
    const unlock = () => {
      if (document.body.classList.contains("klaviyo-prevent-body-scrolling"))
        document.body.classList.remove("klaviyo-prevent-body-scrolling");
    };
    const obs = new MutationObserver(unlock);
    obs.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <style>{`div.kl-private-reset-css-Xuajs1:has(> [data-kl-scroll-locking-modal]){display:none!important}`}</style>
      {/* Kept mounted (hidden) so the photo is already loaded when it opens. */}
      <div className={`fixed inset-0 z-50 items-center justify-center p-4 ${open ? "flex" : "hidden"}`}>
        <div aria-hidden onClick={close} className="absolute inset-0 bg-black/30" />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="signup-title"
          className="relative grid max-h-full w-full max-w-[880px] overflow-y-auto bg-cream text-ink shadow-xl md:grid-cols-2"
        >
          <div className="flex flex-col justify-center gap-8 p-8 md:p-12">
            <div className="flex flex-col gap-3">
              <p className="type-label text-ink-72">Early access</p>
              <h2 id="signup-title" className="type-heading">
                Experience Crosps <SerifAccent>first.</SerifAccent>
              </h2>
              <p className="type-body text-ink-88">
                Join the waitlist and be first to hear when Crosps launches, where it’s stocked, and what’s coming next.
              </p>
            </div>
                        <div>
              <EmailCapture />
            </div>
          </div>
          <div className="relative order-first aspect-[4/3] md:order-none md:aspect-auto md:min-h-[480px]">
            <Image
              src="/v2/signup-boxes.jpg"
              alt=""
              fill
              loading="eager"
              sizes="(max-width: 768px) 100vw, 440px"
              className="object-cover"
            />
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="type-nav absolute right-4 top-4 cursor-pointer bg-white px-3 py-1.5 text-ink hover:opacity-70"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
