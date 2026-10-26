import type { Metadata } from "next";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { FaqDirectory } from "@/components/v2/FaqDirectory";
import Link from "next/link";
import { FAQ_GROUPS, V2_LINKS, gutterStyle, V2_FOOTER_LINKS } from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "FAQ | Crosps",
  description: "Answers about Crosps: ingredients, allergens, ordering and where to buy.",
  robots: { index: false, follow: false },
};

// V2 FAQ (Figma 1:854 heading, Onform-style searchable list).
export default async function V2FaqPage({ searchParams }: { searchParams: Promise<{ gutter?: string }> }) {
  const { gutter } = await searchParams;
  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      <main className="gutter-x flex flex-col gap-12 pb-24 pt-10 md:pt-14">
        <header className="flex flex-col items-start gap-4">
          <h1 className="font-serif text-[40px] italic leading-[1.2] md:text-[48px]">FAQ</h1>
          <p className="type-body text-ink-88">Is there a question we haven’t answered?</p>
          <Link href={V2_LINKS.contact} className="type-body border-b border-ink pb-0.5 text-ink transition-opacity hover:opacity-70">
            Contact Us
          </Link>
        </header>
        <FaqDirectory groups={FAQ_GROUPS} contactHref={V2_LINKS.contact} />
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
