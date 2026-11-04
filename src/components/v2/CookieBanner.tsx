"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setConsent, useConsent } from "@/lib/consent";
import { V2_LINKS } from "@/lib/v2-content";

// Bottom right, over a blurred page (after how.studio). Shown until the visitor chooses;
// reopened from the footer's "Cookie Settings" link (#cookie-settings). Accept and Reject carry equal weight.
const LEAVE_MS = 500; // matches animate-fade-out

// Fine film grain, so the blur reads as frosted glass rather than a flat wash.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function CookieBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  // Policy pages stay readable, so people can check the privacy policy before choosing.
  const blur = !usePathname().startsWith("/policies");

  useEffect(() => {
    // Next's <Link> doesn't fire hashchange, so catch the click itself.
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.('a[href="#cookie-settings"]')) return;
      e.preventDefault();
      setReopened(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  const [leaving, setLeaving] = useState(false);
  const visible = consent !== "unknown" && (consent === null || reopened);

  if (!visible) return null;

  // Fade the blur and banner out, then save the choice.
  const choose = (v: "accepted" | "rejected") => {
    setLeaving(true);
    setTimeout(() => {
      setConsent(v);
      setReopened(false);
      setLeaving(false);
    }, LEAVE_MS);
  };
  const fade = leaving ? "animate-fade-out" : "animate-fade-in";
  const btn = "type-mono flex-1 cursor-pointer rounded-button border border-brown px-6 py-3 transition-colors";

  return (
    <>
      {/* Frosted glass over the page: the page still scrolls underneath, but can't be read or clicked. */}
      {blur && (
        <div
          aria-hidden
          className={`${fade} fixed inset-0 z-[60] bg-gradient-to-b from-paper/25 via-paper/10 to-paper/45 backdrop-blur-[48px] backdrop-saturate-[1.4]`}
        >
          <div className="absolute inset-0 opacity-[0.07] mix-blend-multiply" style={{ backgroundImage: GRAIN }} />
        </div>
      )}
      <div
        role="region"
        aria-label="Cookie consent"
        className={`${fade} fixed inset-x-4 bottom-4 z-[61] flex max-w-[420px] flex-col gap-5 border border-ink-10 bg-white p-6 text-ink shadow-xl sm:left-auto sm:right-6 sm:bottom-6`}
      >
        <div className="flex flex-col gap-2">
          <p className="type-label">Cookies</p>
          <p className="type-small text-ink-88">
            We use essential cookies to keep your basket working. With your OK, we’d also use cookies to see how people use the
            site and to tailor our emails and offers. Read our{" "}
            <Link href={V2_LINKS.policy("privacy-policy")} className="underline underline-offset-4">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => choose("rejected")} className={`${btn} text-ink hover:bg-brown hover:text-white`}>
            Reject
          </button>
          <button type="button" onClick={() => choose("accepted")} className={`${btn} bg-brown text-white hover:bg-brown-88`}>
            Accept
          </button>
        </div>
      </div>
    </>
  );
}
