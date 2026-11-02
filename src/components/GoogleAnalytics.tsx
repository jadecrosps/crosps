"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

// Google Analytics 4 measurement ID — public, safe to expose client-side.
const GA_MEASUREMENT_ID = "G-LPFNLDNGMD";

// Loads only once the visitor accepts cookies on the cookie banner, and not on the
// local dev server, so testing doesn't count as visits.
export function GoogleAnalytics() {
  const consent = useConsent();
  if (process.env.NODE_ENV !== "production" || consent !== "accepted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`}
      </Script>
    </>
  );
}
