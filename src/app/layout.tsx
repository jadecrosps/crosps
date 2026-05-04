import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { saans, daVinci } from "@/lib/fonts";
import { Agentation } from "agentation";
import "./globals.css";

// Klaviyo public Company ID — safe to expose client-side (like a Stripe
// publishable key). Hardcoded intentionally per ops decision; do not
// move to env. See README → newsletter section.
const KLAVIYO_COMPANY_ID = "WSHPRF";

export const metadata: Metadata = {
  title: "Crosps | Vegetable crisps made from real, whole, vegetables.",
  description:
    "Crosps are whole vegetables thoughtfully transformed into gluten-free, plant based crisps that prove vegetables can be extraordinary.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${saans.variable} ${daVinci.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        {process.env.NODE_ENV === "development" && <Agentation />}

        {/* Klaviyo onsite tracking + popup loader — runs on every page so
            the popup form configured in Klaviyo's dashboard surfaces. */}
        <Script
          src={`https://static.klaviyo.com/onsite/js/${KLAVIYO_COMPANY_ID}/klaviyo.js?company_id=${KLAVIYO_COMPANY_ID}`}
          strategy="afterInteractive"
        />
        <Script id="klaviyo-init" strategy="afterInteractive">
          {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
        </Script>
      </body>
    </html>
  );
}
