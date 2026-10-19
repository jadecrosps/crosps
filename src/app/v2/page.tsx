import type { Metadata } from "next";
import { Ticker } from "@/components/v2/Ticker";
import { StorySection } from "@/components/v2/StorySection";
import { Footer } from "@/components/v2/Footer";
import { InstagramFeed } from "@/components/v2/InstagramFeed";
import { HomeHero, ProductRange, QuoteHeading, Stockists, Ingredients, Reviews, WaitlistBanner } from "@/components/v2/HomeSections";
import { TICKER, V2_LINKS, gutterStyle } from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "Crosps | A new world of vegetable crisps",
  description: "Real vegetables, transformed into light, crisp, deeply savoury slices that keep their natural colour, character and flavour.",
  robots: { index: false, follow: false },
};

// V2 homepage (Figma "Landing Page" 1:146). Preview only until launch.
export default async function V2HomePage({ searchParams }: { searchParams: Promise<{ gutter?: string }> }) {
  const { gutter } = await searchParams;
  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <HomeHero links={V2_LINKS} />
      <main>
        <ProductRange links={V2_LINKS} />
        <Ticker items={TICKER} />
        <QuoteHeading>Made from crops, not compromises.</QuoteHeading>
        <StorySection href={V2_LINKS.about} />
        <Stockists links={V2_LINKS} />
        <Ingredients links={V2_LINKS} />
        <Reviews />
        <WaitlistBanner />
        <InstagramFeed />
      </main>
      <Footer links={{ FAQ: V2_LINKS.faq, Contact: V2_LINKS.contact, Stockists: `${V2_LINKS.contact}?topic=stock` }} />
    </div>
  );
}
