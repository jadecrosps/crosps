"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { setConsent, useConsent } from "@/lib/consent";
import { V2_LINKS } from "@/lib/v2-content";

// Shown until the visitor chooses; reopened from the footer's "Cookie Settings"
// link (#cookie-settings). Accept and Reject carry equal weight.
export function CookieBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

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

  if (consent === "unknown" || (consent !== null && !reopened)) return null;

  const choose = (v: "accepted" | "rejected") => {
    setConsent(v);
    setReopened(false);
  };
  const btn = "type-mono flex-1 cursor-pointer rounded-button border border-brown px-6 py-3 transition-colors";

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-30 flex max-w-[420px] flex-col gap-5 border border-ink-10 bg-white p-6 text-ink shadow-xl sm:left-6 sm:right-auto sm:bottom-6"
    >
      <div className="flex flex-col gap-2">
        <p className="type-label">Cookies</p>
        <p className="type-small text-ink-88">
          We use essential cookies to keep your basket working. With your OK, we’d also use cookies to remember you and tailor
          our emails and offers. Read our{" "}
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
  );
}
