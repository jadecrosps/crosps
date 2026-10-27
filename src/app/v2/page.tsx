import type { Metadata } from "next";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Ticker } from "@/components/v2/Ticker";
import { Footer } from "@/components/v2/Footer";
import { InstagramFeed } from "@/components/v2/InstagramFeed";
import { HomeHero, Ingredients } from "@/components/v2/HomeSections";
import {
  IntroStatement,
  ShopRow,
  FeatureCard,
  SocialProof,
  CenteredCta,
  WaitlistCard,
} from "@/components/v2/home/HomeLayout";
import { getShopifyProduct } from "@/lib/shopify";
import {
  PRODUCT_DETAILS,
  PRODUCTS,
  TICKER,
  V2_FOOTER_LINKS,
  V2_LINKS,
  gutterStyle,
  type Product,
} from "@/lib/v2-content";

export const metadata: Metadata = {
  title: "Crosps | A new world of vegetable crisps",
  description: "Real vegetables, transformed into light, crisp, deeply savoury slices that keep their natural colour, character and flavour.",
  robots: { index: false, follow: false },
};

// V2 homepage: Crosps design system in the moremud.co layout. Preview only until launch.
export default async function V2HomePage({ searchParams }: { searchParams: Promise<{ gutter?: string }> }) {
  const { gutter } = await searchParams;

  // Live variant ids for the Add to cart buttons (null until Shopify is connected).
  const entries = await Promise.all(
    PRODUCTS.map(async (p) => {
      const sp = await getShopifyProduct(PRODUCT_DETAILS[p.slug].shopifyHandle);
      return [p.slug, { variantId: sp?.variantId ?? null, available: sp ? sp.availableForSale : true }] as const;
    }),
  );
  const variants = Object.fromEntries(entries) as Record<Product["slug"], { variantId: string | null; available: boolean }>;

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <HomeHero links={V2_LINKS} />
      <main>
        <IntroStatement />
        <ShopRow links={V2_LINKS} variants={variants} />
        <Ticker items={TICKER} />
        <div className="h-20 md:h-32" />
        <FeatureCard
          eyebrow="Why Crosps"
          title={
            <>
              We didn’t want to make another <SerifAccent>crisp.</SerifAccent>
            </>
          }
          image="/v2/story.jpg"
          alt="A pepper crisp next to a fresh slice of pepper"
          cta={{ href: V2_LINKS.about, label: "Our story" }}
        />
        <Ingredients links={V2_LINKS} />
        <SocialProof links={V2_LINKS} />
        <CenteredCta links={V2_LINKS} />
        <WaitlistCard />
        <InstagramFeed />
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
