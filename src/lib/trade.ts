import { storefront } from "./shopify";
import { TRADE_FLAVOURS, type TradeSlug } from "./trade-terms";

export type TradeVariant = { id: string; price: number; available: boolean };

// The hidden "Trade case" products in Shopify (tag "trade", Crosps Headless channel only).
export async function getTradeVariants(): Promise<Partial<Record<TradeSlug, TradeVariant>>> {
  const fields = TRADE_FLAVOURS.map(
    (f) => `${f.slug}: product(handle: "${f.handle}") { variants(first: 1) { nodes { id availableForSale price { amount } } } }`,
  ).join("\n");
  type V = { variants: { nodes: { id: string; availableForSale: boolean; price: { amount: string } }[] } } | null;
  try {
    const data = await storefront<Record<TradeSlug, V>>(`query TradeVariants { ${fields} }`);
    const out: Partial<Record<TradeSlug, TradeVariant>> = {};
    for (const f of TRADE_FLAVOURS) {
      const v = data[f.slug]?.variants.nodes[0];
      if (v) out[f.slug] = { id: v.id, price: Number(v.price.amount), available: v.availableForSale };
    }
    return out;
  } catch (err) {
    console.error("[trade] variant fetch failed", err);
    return {};
  }
}
