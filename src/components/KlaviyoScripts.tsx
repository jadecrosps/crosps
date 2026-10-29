"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";

// Klaviyo public Company ID — safe to expose client-side (like a Stripe
// publishable key). Hardcoded intentionally per ops decision; do not
// move to env. See README → newsletter section.
const KLAVIYO_COMPANY_ID = "WSHPRF";

// Internal review pages where the sign-up popup would get in the way.
const EXCLUDED_PREFIXES = ["/design-system"];
// Pages behind the cookie banner: Klaviyo only loads once the visitor accepts.
const CONSENT_PREFIXES = ["/v2"];

export function KlaviyoScripts() {
  const pathname = usePathname();
  const consent = useConsent();
  if (EXCLUDED_PREFIXES.some((p) => pathname?.startsWith(p))) return null;
  if (CONSENT_PREFIXES.some((p) => pathname?.startsWith(p)) && consent !== "accepted") return null;

  return (
    <>
      <Script
        src={`https://static.klaviyo.com/onsite/js/${KLAVIYO_COMPANY_ID}/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
        strategy="afterInteractive"
      />
      <Script id="klaviyo-init" strategy="afterInteractive">
        {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
      </Script>
    </>
  );
}
