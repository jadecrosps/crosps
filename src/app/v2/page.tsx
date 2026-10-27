import type { Metadata } from "next";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Nav } from "@/components/v2/Nav";
import { Ticker } from "@/components/v2/Ticker";
import { Footer } from "@/components/v2/Footer";
import { InstagramFeed } from "@/components/v2/InstagramFeed";
import { IngredientsSplit } from "@/components/v2/home/IngredientsSplit";
import {
  InsetHero,
  IntroStatement,
  ShopRow,
  FeatureCard,
  SocialProof,
  CenteredCta,
  WaitlistCard,
} from "@/components/v2/home/HomeLayout";
import { getShopifyProduct } from "@/lib/shopify";
import {
  INGREDIENT_INFO,
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

const INGREDIENT_SLIDES = [
  {
    title: "88–90% real vegetable.",
    body: "Tomato, onion or pepper, sliced and gently cooked so each crisp keeps the colour, shape and flavour of the vegetable it came from.",
    image: "/v2/ing-tomato.jpg",
    alt: "Fresh tomato",
  },
  { title: "Rapeseed oil.", body: INGREDIENT_INFO.oil, image: "/v2/ing-oil.jpg", alt: "Rapeseed oil" },
  { title: "Tapioca starch.", body: INGREDIENT_INFO.tapioca, image: "/v2/ing-tapioca.jpg", alt: "Tapioca starch" },
  {
    title: "A touch of sea salt.",
    body: "Just enough to bring out the vegetable’s natural flavour. Nothing else added.",
    image: "/v2/ing-salt.jpg",
    alt: "Sea salt",
    overlay: "rgba(206,207,212,0.5)",
  },
];

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
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />
      <main>
        <InsetHero links={V2_LINKS} />
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
        <IngredientsSplit eyebrow="The standard" slides={INGREDIENT_SLIDES} />
        <SocialProof links={V2_LINKS} />
        <CenteredCta links={V2_LINKS} />
        <WaitlistCard />
        <InstagramFeed />
      </main>
      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
