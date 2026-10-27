import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { ProductCard } from "@/components/v2/ProductCard";
import { MobileCarousel } from "@/components/v2/MobileCarousel";
import { Tag } from "@/components/v2/Tag";
import { Ticker } from "@/components/v2/Ticker";
import { ReviewCard } from "@/components/v2/ReviewCard";
import { BenefitsBlock } from "@/components/v2/product/BenefitsBlock";
import { QuickAdd } from "@/components/v2/home/QuickAdd";
import { RowHeader, PillLink } from "@/components/v2/home/HomeLayout";
import { Accordion } from "@/components/v2/Accordion";
import { IngredientCard } from "@/components/v2/IngredientCard";
import { ProductGallery } from "@/components/v2/product/ProductGallery";
import { ProductPurchase } from "@/components/v2/product/ProductPurchase";
import { NutritionTable } from "@/components/v2/product/ProductBenefits";
import { getShopifyProduct } from "@/lib/shopify";
import {
  ALLERGEN_NOTE,
  REVIEWS,
  TICKER,
  INGREDIENT_INFO,
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

// V2 product page: Figma "Product Page" (1:1102) content in the moremud.co product layout.
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
  const fmt = (n: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: price.currencyCode }).format(n);

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />

      <main>
        {/* Gallery left, cream product panel right */}
        <section className="gutter-x grid gap-2 pb-20 pt-2 lg:grid-cols-2">
          <div className="lg:sticky lg:top-4 lg:self-start">
            <ProductGallery slides={details.gallery} tag={product.tag} />
          </div>

          <div className="flex flex-col gap-8 bg-cream p-6 md:p-10 xl:p-12">
            <div className="flex flex-col gap-4">
              {product.status && <p className="type-label text-ink-50">{product.status}</p>}
              <h1 className="font-sans text-[32px] leading-[1.1] md:text-[40px]">{product.name}</h1>
              <div className="flex flex-wrap gap-2">
                {CLAIMS.map((c) => (
                  <Tag key={c} tone="light">
                    {c}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="type-body-lg text-ink">{product.descriptor}</p>
              {details.paragraphs.map((p) => (
                <p key={p} className="type-body text-ink-88">
                  {p}
                </p>
              ))}
              <ul className="flex flex-col gap-2">
                {details.benefits.map((b) => (
                  <li key={b} className="type-body flex items-start gap-3 text-ink">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-ink" />
                    {b}
                  </li>
                ))}
              </ul>
              <p className="type-mono text-ink-72">8 packs of 30g · {fmt(price.amount)}</p>
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
        <div className="h-20 md:h-32" />

        <BenefitsBlock
          title={
            <>
              Why you’ll love {product.name}
            </>
          }
          image={product.hoverImage}
          alt={`${product.name} in hand`}
          stats={[details.stats[0], details.stats[2], details.stats[4], details.stats[1]]}
        />

        {/* Ingredients row */}
        <section className="gutter-x flex flex-col gap-8 py-20 md:py-32">
          <RowHeader title="Only four ingredients" action={<PillLink href="#ingredients-list">Full ingredient list</PillLink>} />
          <div className="grid w-full grid-cols-2 gap-x-2 gap-y-6 lg:grid-cols-4">
            <IngredientCard label={details.vegetable.label} image={details.vegetable.image} crop={details.vegetable.crop} />
            <IngredientCard
              label="Rapeseed Oil"
              image="/v2/ing-oil.jpg"
              crop={{ width: 175.26, height: 134.94, left: -10.76, top: -17.45 }}
              info={INGREDIENT_INFO.oil}
            />
            <IngredientCard label="Tapioca Starch" image="/v2/ing-tapioca.jpg" info={INGREDIENT_INFO.tapioca} />
            <IngredientCard label="Sea Salt" image="/v2/ing-salt.jpg" overlay="rgba(206,207,212,0.5)" />
          </div>
          <p id="ingredients-list" className="type-body scroll-mt-24 max-w-[720px] text-ink-72">
            <span className="text-ink">Full ingredient list: </span>
            {details.ingredients}
          </p>
        </section>

        {/* Reviews */}
        <section className="gutter-x flex flex-col gap-8 pb-20 md:pb-32">
          <RowHeader title="Worth talking about." />
          <MobileCarousel label="Reviews" className="md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:gap-2">
            {REVIEWS.map((r) => (
              <div key={r.author} className="flex h-full items-center justify-center bg-cream px-6 py-10">
                <ReviewCard {...r} />
              </div>
            ))}
          </MobileCarousel>
        </section>

        {/* You may also like */}
        <section className="gutter-x flex flex-col gap-8 border-t border-ink-10 py-20 md:py-28">
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
      </main>

      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
