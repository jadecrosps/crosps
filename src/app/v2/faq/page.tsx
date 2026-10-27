import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { FaqDirectory } from "@/components/v2/FaqDirectory";
import { Button, TextLink } from "@/components/v2/Button";
import { FAQ_GROUPS, V2_LINKS, gutterStyle, V2_FOOTER_LINKS } from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "FAQ | Crosps",
  description: "Answers about Crosps: ingredients, allergens, ordering and where to buy.",
  robots: { index: false, follow: false },
};

// V2 FAQ: moremud.co support-centre layout (photo banner, centred intro, large category nav,
// contact panel) around the Crosps searchable list.
export default async function V2FaqPage({ searchParams }: { searchParams: Promise<{ gutter?: string }> }) {
  const { gutter } = await searchParams;
  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      <main className="flex flex-col pb-20 md:pb-32">
        {/* Photo banner with the title over it */}
        <section className="px-5 pt-2 md:px-10">
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden md:aspect-[1633/620]">
            <Image src="/v2/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-black/35" />
            <h1 className="relative font-serif text-[56px] italic leading-none text-white md:text-[96px]">FAQ</h1>
          </div>
        </section>

        {/* Centred intro */}
        <section className="gutter-x flex justify-center py-16 md:py-24">
          <div className="flex max-w-[900px] flex-col items-center gap-6 text-center">
            <p className="font-sans text-[24px] leading-[1.2] text-ink md:text-[32px]">
              Everything you need to know about Crosps, from what goes into every bag to where to find us.
            </p>
            <TextLink href={V2_LINKS.contact}>Is there a question we haven’t answered?</TextLink>
          </div>
        </section>

        <div className="gutter-x">
          <FaqDirectory groups={FAQ_GROUPS} contactHref={V2_LINKS.contact} />
        </div>

        {/* Contact panel */}
        <section className="gutter-x pt-20 md:pt-32">
          <div className="grid overflow-hidden bg-cream md:grid-cols-[minmax(0,420px)_1fr]">
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[360px]">
              <Image src="/v2/founder.jpg" alt="Jade holding packs of Crosps" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
            </div>
            <div className="flex flex-col items-start justify-center gap-6 p-8 md:p-14">
              <h2 className="type-heading text-ink">Still have a question?</h2>
              <p className="type-body max-w-[440px] text-ink-88">
                Send us a message and we’ll get back to you. Whether it’s about an order, an ingredient or stocking Crosps, we’re happy to help.
              </p>
              <Button href={V2_LINKS.contact}>Contact us</Button>
            </div>
          </div>
        </section>
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
