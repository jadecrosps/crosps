import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { saans, daVinci, saansMono } from "@/lib/fonts";
import { Agentation } from "agentation";
import { KlaviyoScripts } from "@/components/KlaviyoScripts";
import "./globals.css";

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
    <html lang="en" className={`${saans.variable} ${daVinci.variable} ${saansMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        {process.env.NODE_ENV === "development" && <Agentation />}

        {/* Klaviyo onsite tracking + popup loader — the popup form itself is
            configured in Klaviyo's dashboard. */}
        <KlaviyoScripts />
      </body>
    </html>
  );
}
