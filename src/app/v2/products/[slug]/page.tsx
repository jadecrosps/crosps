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
import { Comparison, FaqBand } from "@/components/v2/product/ProductSections";
import { QuickAdd } from "@/components/v2/home/QuickAdd";
import { RowHeader, PillLink } from "@/components/v2/home/HomeLayout";
import { Accordion } from "@/components/v2/Accordion";
import { withAllergens } from "@/components/v2/Allergens";
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
  SHOP_OPEN,
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
  };
}

// Pack claims shown as a checklist in the product panel.
const CLAIMS = ["Just four ingredients", "Real vegetables, sliced", "Naturally high fibre", "Plant based", "Gluten free", "No added sugar"];

// The short FAQ on product pages: product questions only. The rest stay on the FAQ page.
const PRODUCT_FAQ = FAQ_GROUPS.filter((g) => g.id === "ingredients" || g.id === "product").map((g) => ({
  ...g,
  items: g.items.filter((q) => q.question !== "Is the packaging recyclable?"),
}));

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

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />

      <main>
        {/* Gallery left (thumbnails down the side), product panel right */}
        <section className="gutter-x grid gap-8 pb-20 pt-2 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
          {/* Sits still in the page (no sticky), sized to fit the screen, so it never shifts
              when the details scroll or the dropdowns open. */}
          <div className="min-w-0 lg:h-[calc(100svh-108px)] lg:self-start">
            <ProductGallery slides={details.gallery} tag={product.tag} />
          </div>

          <div className="flex flex-col gap-8 lg:pt-4">
            <div className="flex flex-col gap-4">
              <a href="#reviews" className="type-small flex items-center gap-2 text-ink-72 hover:text-ink">
                <Image src="/v2/stars.svg" alt="5 out of 5 stars" width={88} height={15} />
                Loved by our first tasters
              </a>
              <h1 className="font-sans text-[32px] leading-[1.1] md:text-[44px]">{product.name}</h1>
              {product.status && (
                <div>
                  <Tag tone="light">{product.status} · 8 packs of 30g</Tag>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <p className="type-body text-ink-88">{details.description}</p>
              <ul className="grid justify-start gap-x-10 gap-y-1 sm:grid-cols-[auto_auto]">
                {CLAIMS.map((c) => (
                  <li key={c} className="type-body flex items-center gap-3 text-ink">
                    <span aria-hidden className="text-[14px]">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>

            <ProductPurchase
              variantId={shopify?.variantId ?? null}
              price={price}
              available={SHOP_OPEN && (shopify ? shopify.availableForSale : true)}
              sellingPlans={shopify?.sellingPlans ?? []}
            />

            <div className="border-t border-ink-10">
              <Accordion title="Ingredients">{details.ingredients}</Accordion>
              <Accordion title="Nutrition">
                <NutritionTable rows={details.nutrition} />
              </Accordion>
              <Accordion title="Allergens">{withAllergens(ALLERGEN_NOTE)}</Accordion>
              <Accordion title="How to enjoy">
                Perfect as they are, straight from the bag. Or crumble them over salads and soups for extra crunch. Store
                in a cool, dry place.
              </Accordion>
            </div>
          </div>
        </section>

        <Ticker items={TICKER} />

        <Comparison
          title={
            <>
              A different kind of <SerifAccent>crisp.</SerifAccent>
            </>
          }
          intro="We didn’t want to make another crisp. Here’s how Crosps compares."
          rows={["Base", "Vegetable content", "Ingredients", "Fibre per 100g"]}
          columns={[
            { name: "Potato crisps", values: ["Potato", "Potato only", "3 to 20+", "3.5–6.7g"] },
            {
              name: "Crosps",
              highlight: true,
              image: product.image,
              imageAlt: `${product.name} pack`,
              values: ["Tomato, onion, bell pepper", "88–90% whole veg", "4", "14–27g"],
            },
            { name: "Traditional veg crisps", values: ["Usually root vegetables", "60–65% mixed root", "3", "~10–11g"] },
            { name: "Lentil crisps", values: ["Lentil flour + starches", "28–43% lentil", "5 to 15+", "~1–5g"] },
          ]}
        />

        <ReviewsMarquee />

        {/* You may also like */}
        <section className="gutter-x flex flex-col gap-8 py-20 md:py-28">
          <RowHeader title="You may also like" action={<PillLink href={V2_LINKS.shop}>Shop all →</PillLink>} />
          <MobileCarousel label="More flavours" className="md:grid-cols-3 md:gap-5">
            {others.map((p: Product, n) => (
              <div key={p.slug} className="flex flex-col gap-4">
                <ProductCard {...p} price={SHOP_OPEN ? p.price : undefined} href={V2_LINKS.product(p.slug)} />
                <QuickAdd
                  href={V2_LINKS.product(p.slug)}
                  variantId={otherVariants[n]?.variantId ?? null}
                  available={SHOP_OPEN && (otherVariants[n] ? otherVariants[n].availableForSale : true)}
                />
              </div>
            ))}
          </MobileCarousel>
        </section>

        <FaqBand
          groups={PRODUCT_FAQ}
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
