"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { setConsent, useConsent } from "@/lib/consent";
import { V2_LINKS } from "@/lib/v2-content";

// Bottom right, over a blurred page (after how.studio), with a "Learn more" note on each tool. Shown until the visitor chooses;
// reopened from the footer's "Cookie Settings" link (#cookie-settings). Accept and Reject carry equal weight.
const LEAVE_MS = 500; // matches animate-fade-out
// Let the page be seen for a moment before the blur and banner ease in.
const ENTER_DELAY_MS = 1200;

// Film grain over the blur; it shifts a few times a second, like projected film.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

// What "Accept" turns on. Klaviyo and Google Analytics only load after Accept (KlaviyoScripts, GoogleAnalytics).
const COOKIE_TOOLS = [
  {
    name: "Essential",
    body: "Keeps your basket and checkout working. These are always on.",
  },
  {
    name: "Google Analytics",
    body: "Shows us how people find and move around the site: where they came from and which pages they visit. This data is not connected to any personal information.",
  },
  {
    name: "Klaviyo",
    body: "Helps us tailor our emails and offers to what you’ve looked at. If you’ve signed up to our emails, this is linked to that address.",
  },
];

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
  const [details, setDetails] = useState(false);
  const detailsId = useId();
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
  // No wait when reopened from Cookie Settings.
  const enter = leaving || reopened ? undefined : { animationDelay: `${ENTER_DELAY_MS}ms` };
  const btn =
    "type-mono normal-case flex h-[52px] w-full cursor-pointer items-center justify-center rounded-button transition-colors";

  return (
    <>
      {/* Frosted glass over the page: the page still scrolls underneath, but can't be read or clicked. */}
      {blur && (
        <div
          aria-hidden
          style={enter}
          className={`${fade} fixed inset-0 z-[60] overflow-hidden bg-gradient-to-b from-paper/25 via-paper/10 to-paper/45 backdrop-blur-[26px] backdrop-saturate-[1.3]`}
        >
          <div
            className="absolute -inset-[60px] animate-grain opacity-[0.15] motion-reduce:animate-none"
            style={{ backgroundImage: GRAIN }}
          />
        </div>
      )}
      <div
        role="region"
        aria-label="Cookie consent"
        style={enter}
        className={`${fade} fixed inset-x-4 bottom-4 z-[61] flex max-h-[calc(100dvh-2rem)] max-w-[400px] flex-col overflow-y-auto rounded-[10px] bg-paper p-6 text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] sm:left-auto sm:right-6 sm:bottom-6`}
      >
        <p className="type-mono normal-case leading-[1.45] text-ink-72">
          We use cookies to keep the site and your basket working, and with your OK, to understand how the site is used.
          {/* The policy link appears with the Learn more notes. Cookies are covered in the privacy policy. */}
          {details && (
            <>
              {" "}
              <Link href={V2_LINKS.policy("privacy-policy")} className="text-ink underline underline-offset-4">
                Cookie policy
              </Link>
            </>
          )}
        </p>

        {/* "Learn more" opens a note on each tool. */}
        <div
          id={detailsId}
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
            details ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div inert={!details} className="min-h-0 overflow-hidden">
            <dl className="flex flex-col gap-5 pt-6">
              {COOKIE_TOOLS.map((t) => (
                <div key={t.name} className="flex flex-col gap-1">
                  <dt className="type-mono normal-case text-ink">{t.name}</dt>
                  <dd className="type-mono normal-case leading-[1.45] text-ink-72">{t.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <button type="button" onClick={() => choose("accepted")} className={`${btn} bg-brown text-white hover:bg-brown-88`}>
            Accept
          </button>
          <button type="button" onClick={() => choose("rejected")} className={`${btn} bg-stone text-ink hover:bg-ink-10`}>
            No thanks
          </button>
          {!details && (
            <button
              type="button"
              aria-expanded={details}
              aria-controls={detailsId}
              onClick={() => setDetails(true)}
              className="type-mono mt-2 cursor-pointer self-center normal-case text-ink-72 underline underline-offset-4 hover:text-ink"
            >
              Learn more
            </button>
          )}
        </div>
      </div>
    </>
  );
}
