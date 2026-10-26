import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/v2/Nav";
import { Footer } from "@/components/v2/Footer";
import { ProductCard } from "@/components/v2/ProductCard";
import { SectionHeading } from "@/components/v2/SectionHeading";
import { Accordion } from "@/components/v2/Accordion";
import { IngredientCard } from "@/components/v2/IngredientCard";
import { ProductGallery } from "@/components/v2/product/ProductGallery";
import { ProductPurchase } from "@/components/v2/product/ProductPurchase";
import { ProductBenefits, NutritionTable } from "@/components/v2/product/ProductBenefits";
import { getShopifyProduct } from "@/lib/shopify";
import {
  ALLERGEN_NOTE,
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

// V2 product page: Figma "Product Page" (1:1102) content in a Lobie-style layout.
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

  return (
    <div className="bg-white text-ink" style={gutterStyle(gutter)}>
      <Nav tone="dark" links={{ home: V2_LINKS.home, shop: V2_LINKS.shop, about: V2_LINKS.about, faq: V2_LINKS.faq }} />

      <main>
        <section className="gutter-x grid gap-10 pb-20 pt-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24">
          <ProductGallery slides={details.gallery} tag={product.tag} />

          <div className="flex flex-col gap-8 lg:sticky lg:top-6 lg:self-start lg:pt-6">
            <div className="flex flex-col gap-3">
              {product.status && <p className="type-label text-ink-50">{product.status}</p>}
              <h1 className="font-sans text-[32px] leading-[1.1] md:text-[40px]">{product.name}</h1>
              <p className="type-price text-[18px]">
                {new Intl.NumberFormat("en-GB", { style: "currency", currency: price.currencyCode }).format(price.amount)}
              </p>
              <p className="type-small text-ink-88">
                <span className="underline underline-offset-2">Shipping</span> calculated at checkout.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {details.paragraphs.map((p) => (
                <p key={p} className="type-body-lg text-ink-88">
                  {p}
                </p>
              ))}
            </div>

            <ProductBenefits benefits={details.benefits} stats={details.stats} />

            <div className="flex flex-col gap-3">
              <p className="type-mono">8 packs of 30g</p>
              <hr className="border-0 border-t border-ink-10" />
            </div>

            <ProductPurchase
              variantId={shopify?.variantId ?? null}
              price={price}
              available={shopify ? shopify.availableForSale : true}
              sellingPlans={shopify?.sellingPlans ?? []}
            />


            <div>
              <Accordion title="Ingredients">
                {details.ingredients}
              </Accordion>
              <Accordion title="Nutrition">
                <NutritionTable rows={details.nutrition} />
              </Accordion>
              <Accordion title="Allergens">{ALLERGEN_NOTE}</Accordion>
            </div>
          </div>
        </section>

        {/* Figma 1:1205: this product's four ingredients */}
        <section className="gutter-x flex flex-col items-center gap-10 py-20 md:py-28">
          <SectionHeading
            title="Only four ingredients"
            subtitle={
              <>
                We put our ingredients where you can see them.
                <br />
                The vegetable is the product.
              </>
            }
          />
          <div className="grid w-full gap-6 sm:grid-cols-2 md:gap-2 lg:grid-cols-4">
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
        </section>

        {/* Figma 1:1237 / Lobie "Complete the Collection" */}
        <section className="gutter-x flex flex-col gap-8 border-t border-ink-10 py-20 md:py-28">
          <div className="flex flex-col gap-2">
            <h2 className="type-heading uppercase">Shop Crosps</h2>
            <p className="type-body max-w-[557px] text-ink-88">
              Real vegetables transformed into light, crispy, savoury snacks, all while intensifying their natural colour and
              flavour through the process.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:max-w-[66%]">
            {others.map((p: Product) => (
              <ProductCard key={p.slug} {...p} href={V2_LINKS.product(p.slug)} />
            ))}
          </div>
        </section>
      </main>

      <Footer links={V2_FOOTER_LINKS} />
    </div>
  );
}
