import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { ProductCard } from "@/components/v2/ProductCard";
import { MobileCarousel } from "@/components/v2/MobileCarousel";
import { Tag } from "@/components/v2/Tag";
import { Ticker } from "@/components/v2/Ticker";
import { ReviewsMarquee } from "@/components/v2/ReviewsMarquee";
import { InstagramFeed } from "@/components/v2/InstagramFeed";
import { SerifAccent } from "@/components/ui/SerifAccent";
import { Comparison, FaqBand, FeatureCards, IngredientChecklist, SplitFeature } from "@/components/v2/product/ProductSections";
import { QuickAdd } from "@/components/v2/home/QuickAdd";
import { RowHeader, PillLink } from "@/components/v2/home/HomeLayout";
import { Accordion } from "@/components/v2/Accordion";
import { ProductGallery } from "@/components/v2/product/ProductGallery";
import { ProductPurchase } from "@/components/v2/product/ProductPurchase";
import { NutritionTable } from "@/components/v2/product/ProductBenefits";
import { getShopifyProduct } from "@/lib/shopify";
import {
  ALLERGEN_NOTE,
  FAQ_GROUPS,
  TICKER,
  PRODUCT_DETAILS,
  PRODUCTS,
  V2_LINKS,
  gutterStyle,
  type Product,
  V2_FOOTER_LINKS,
} from "@/lib/v2-content";

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<{ gutter?: string }> };

function find(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = find((await params).slug);
  return {
    title: product ? `${product.name} | Crosps` : "Crosps",
    description: product?.descriptor,
    robots: { index: false, follow: false },
  };
}

// Pack claims shown as tags in the product panel.
const CLAIMS = ["Plant based", "Gluten free", "High fibre", "No added sugar"];

// V2 product page: Figma "Product Page" (1:1102) content in the pludolabs.com product layout.
export default async function ProductPage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { gutter } = await searchParams;
  const product = find(slug);
  if (!product) notFound();

  const details = PRODUCT_DETAILS[product.slug];
  const shopify = await getShopifyProduct(details.shopifyHandle);
  // Fallback price from content ("21.99 GBP") until Shopify is connected.
  const [fallbackAmount, fallbackCurrency] = product.price.split(" ");
  const price = shopify
    ? { amount: Number(shopify.price.amount), currencyCode: shopify.price.currencyCode }
    : { amount: Number(fallbackAmount), currencyCode: fallbackCurrency };
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);
  // Live variant ids for the "You may also like" Add to cart buttons.
  const otherVariants = await Promise.all(others.map((p) => getShopifyProduct(PRODUCT_DETAILS[p.slug].shopifyHandle)));
  const veg = details.vegetable.label.toLowerCase();
  const stat = (n: number) => `${details.stats[n].value}${details.stats[n].unit ?? ""}`;

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />

      <main>
        {/* Gallery left (thumbnails down the side), product panel right */}
        <section className="gutter-x grid gap-8 pb-20 pt-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          {/* Fits the screen height so it stays fixed while the details scroll and the dropdowns open. */}
          <div className="min-w-0 lg:sticky lg:top-4 lg:h-[calc(100svh-2rem)] lg:self-start">
            <ProductGallery slides={details.gallery} tag={product.tag} />
          </div>

          <div className="flex flex-col gap-8 lg:pt-4">
            <div className="flex flex-col gap-4">
              <a href="#reviews" className="type-small flex items-center gap-2 text-ink-72 hover:text-ink">
                <Image src="/v2/stars.svg" alt="5 out of 5 stars" width={88} height={15} />
                Loved by our first tasters
              </a>
              <h1 className="font-sans text-[32px] leading-[1.1] md:text-[44px]">{product.name}</h1>
              <div className="flex flex-wrap gap-2">
                {CLAIMS.map((c) => (
                  <Tag key={c} tone="light">
                    {c}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {product.status && <p className="type-mono text-ink-72">{product.status} · 8 packs of 30g</p>}
              <p className="font-serif text-[24px] italic leading-[1.2] text-ink">{details.tagline ?? product.descriptor}</p>
              <p className="type-body text-ink-88">{details.description}</p>
              <ul className="flex flex-col gap-2">
                {details.benefits.map((b) => (
                  <li key={b} className="type-body flex items-start gap-3 text-ink-88">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-ink" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            <ProductPurchase
              variantId={shopify?.variantId ?? null}
              price={price}
              available={shopify ? shopify.availableForSale : true}
              sellingPlans={shopify?.sellingPlans ?? []}
            />

            <div className="border-t border-ink-10">
              <Accordion title="Ingredients">{details.ingredients}</Accordion>
              <Accordion title="Nutrition">
                <NutritionTable rows={details.nutrition} />
              </Accordion>
              <Accordion title="Allergens">{ALLERGEN_NOTE}</Accordion>
              <Accordion title="How to enjoy">
                Perfect as they are, straight from the bag. Or crumble them over salads and soups for extra crunch. Store
                in a cool, dry place.
              </Accordion>
            </div>
          </div>
        </section>

        <Ticker items={TICKER} />

        <FeatureCards
          title={
            <>
              Why you’ll love <SerifAccent>{product.name}</SerifAccent>
            </>
          }
          intro="Most crisps start with potato or corn. Ours start with the vegetable, and keep its colour, character and flavour."
          cards={[
            {
              image: details.vegetable.image,
              alt: `Fresh ${veg}`,
              title: `${stat(0)} real ${veg}`,
              body: "The vegetable comes first, not potato or corn.",
            },
            {
              image: "/v2/crisps-mix.jpg",
              alt: "Crosps vegetable crisps",
              title: "Gently crisped",
              body: "A gentle bake keeps the flavour, the colour and the crunch.",
            },
            {
              image: "/v2/lifestyle-pack.jpg",
              alt: "Carrying Crosps",
              title: `${stat(2)} fibre per 100g`,
              body: "High in fibre, with zero added sugar.",
            },
          ]}
        />

        <Comparison
          title={
            <>
              A different kind of <SerifAccent>crisp.</SerifAccent>
            </>
          }
          intro="We didn’t want to make another crisp. Here’s what sets Crosps apart."
          pack={product.image}
          packAlt={`${product.name} pack`}
          rows={[
            { label: "Real vegetable as the main ingredient", us: true, them: false },
            { label: "Keeps the vegetable’s natural colour", us: true, them: false },
            { label: "High in fibre", us: true, them: false },
          ]}
        />

        <SplitFeature image={product.hoverImage} alt={`${product.name} in hand`} tone="cream">
          <h2 className="type-heading text-ink">
            Why it tastes like <SerifAccent>{veg}.</SerifAccent>
          </h2>
          {details.paragraphs.map((p) => (
            <p key={p} className="type-body text-ink-88">
              {p}
            </p>
          ))}
        </SplitFeature>

        <SplitFeature
          flip
          media={
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-px bg-cream">
              {[
                { src: details.vegetable.image, alt: `Fresh ${veg}` },
                { src: "/v2/ing-oil.jpg", alt: "Rapeseed oil" },
                { src: "/v2/ing-tapioca.jpg", alt: "Tapioca starch" },
                { src: "/v2/ing-salt.jpg", alt: "Sea salt" },
              ].map((i) => (
                <div key={i.src} className="relative">
                  <Image src={i.src} alt={i.alt} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                </div>
              ))}
            </div>
          }
        >
          <h2 className="type-heading text-ink">Only four ingredients</h2>
          <p className="type-body text-ink-88">Simple, recognisable ingredients, and nothing you need to look up.</p>
          <IngredientChecklist
            items={[
              { name: details.vegetable.label, note: `${stat(0)} of every bag` },
              { name: "Rapeseed oil", note: "naturally low in saturated fat, with a clean, neutral taste" },
              { name: "Tapioca starch", note: "helps each slice crisp evenly" },
              { name: "Sea salt", note: "just a touch" },
            ]}
          />
          <p className="type-small text-ink-72">Full ingredient list: {details.ingredients}</p>
        </SplitFeature>

        <ReviewsMarquee />

        {/* You may also like */}
        <section className="gutter-x flex flex-col gap-8 py-20 md:py-28">
          <RowHeader title="You may also like" action={<PillLink href={V2_LINKS.shop}>Shop all →</PillLink>} />
          <MobileCarousel label="More flavours" className="md:grid-cols-3 md:gap-5">
            {others.map((p: Product, n) => (
              <div key={p.slug} className="flex flex-col gap-4">
                <ProductCard {...p} href={V2_LINKS.product(p.slug)} />
                <QuickAdd
                  href={V2_LINKS.product(p.slug)}
                  variantId={otherVariants[n]?.variantId ?? null}
                  available={otherVariants[n] ? otherVariants[n].availableForSale : true}
                />
              </div>
            ))}
          </MobileCarousel>
        </section>

        <FaqBand
          groups={FAQ_GROUPS.filter((g) => g.id !== "stockists")}
          image="/v2/founder.jpg"
          alt="Crosps founder"
          href={V2_LINKS.faq}
        />
        <InstagramFeed />
      </main>

      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
