import { PRODUCTS, PRODUCT_DETAILS, SHOP_OPEN } from "@/lib/v2-content";
import { getShopifyProduct } from "@/lib/shopify";

// Product feed for Google Merchant Center (account 5898410168), fetched by Google once a day.
// Links, prices and stock here must match the product pages on eatcrosps.com.
// Stock follows the shop switch: "out of stock" until SHOP_OPEN is true.
export const revalidate = 3600;

const SITE = "https://eatcrosps.com";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  const items = await Promise.all(
    PRODUCTS.map(async (p) => {
      const d = PRODUCT_DETAILS[p.slug];
      const shopify = await getShopifyProduct(d.shopifyHandle);
      const [fallbackAmount, fallbackCurrency] = p.price.split(" ");
      const amount = shopify ? Number(shopify.price.amount) : Number(fallbackAmount);
      const currency = shopify?.price.currencyCode ?? fallbackCurrency;
      const inStock = SHOP_OPEN && (shopify ? shopify.availableForSale : true);
      const extra = d.gallery.filter((g) => !g.src.startsWith("http") && g.src !== p.image).slice(0, 5);
      return `    <item>
      <g:id>${esc(d.shopifyHandle)}</g:id>
      <g:title>${esc(`Crosps ${p.name}, 8 × 30g bags`)}</g:title>
      <g:description>${esc(`${d.description} Just four ingredients: ${d.ingredients} A case of 8 × 30g bags.`)}</g:description>
      <g:link>${SITE}/products/${p.slug}</g:link>
      <g:image_link>${SITE}${p.image}</g:image_link>
${extra.map((g) => `      <g:additional_image_link>${SITE}${g.src}</g:additional_image_link>`).join("\n")}
      <g:availability>${inStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${amount.toFixed(2)} ${currency}</g:price>
      <g:brand>Crosps</g:brand>
      <g:identifier_exists>no</g:identifier_exists>
      <g:condition>new</g:condition>
      <g:google_product_category>423</g:google_product_category>
      <g:product_type>Snacks &gt; Vegetable crisps</g:product_type>
      <g:multipack>8</g:multipack>
      <g:shipping_weight>240 g</g:shipping_weight>
    </item>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Crosps</title>
    <link>${SITE}</link>
    <description>Crosps vegetable crisps</description>
${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
