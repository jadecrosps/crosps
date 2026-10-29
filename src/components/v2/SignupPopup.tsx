"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { useConsent } from "@/lib/consent";
import { EmailCapture } from "./EmailCapture";

// Early-access popup in the Crosps design system, replacing Klaviyo's own popup on V2.
// Sign-ups go to the same Klaviyo list as the footer form. Waits until the cookie
// banner has been answered, then opens once; closing or signing up stops it coming back.

const DISMISSED = "crosps_signup_dismissed";
const DELAY_MS = 6000;

function dismissed() {
  try {
    return localStorage.getItem(DISMISSED) === "1";
  } catch {
    return false;
  }
}

function remember() {
  try {
    localStorage.setItem(DISMISSED, "1");
  } catch {}
}

export function SignupPopup() {
  const consent = useConsent();
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  function close() {
    remember();
    setOpen(false);
  }

  useEffect(() => {
    if (consent === "unknown" || consent === null || dismissed()) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [consent]);

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
            {/* Once they've submitted, don't show the popup again. */}
            <div onSubmitCapture={remember}>
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
