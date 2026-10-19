// Shopify Storefront API client (server-side only: import from server
// components and server actions, never from client components).
//
// Env vars (Vercel + .env.local):
//   SHOPIFY_STORE_DOMAIN      e.g. "your-store.myshopify.com"
//   SHOPIFY_STOREFRONT_TOKEN  public Storefront API token from the Headless channel
//
// Until both are set, shopifyConfigured() is false and the V2 pages fall back
// to the prices in src/lib/v2-content.ts with checkout disabled.

const API_VERSION = "2025-01";

export function shopifyConfigured(): boolean {
  return !!(process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_TOKEN);
}

export async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_TOKEN;
  if (!domain || !token) throw new Error("shopify_not_configured");

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Storefront-Access-Token": token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`shopify_http_${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data as T;
}

export type Money = { amount: string; currencyCode: string };

export function formatMoney(m: Money): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: m.currencyCode }).format(Number(m.amount));
}

// ── Products ──────────────────────────────────────────────

export type SellingPlan = { id: string; name: string; percentOff: number | null };

export type ShopifyProduct = {
  title: string;
  handle: string;
  availableForSale: boolean;
  variantId: string;
  price: Money;
  sellingPlans: SellingPlan[];
};

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      title
      handle
      availableForSale
      variants(first: 1) {
        nodes {
          id
          price { amount currencyCode }
        }
      }
      sellingPlanGroups(first: 1) {
        nodes {
          sellingPlans(first: 5) {
            nodes {
              id
              name
              priceAdjustments {
                adjustmentValue {
                  ... on SellingPlanPercentagePriceAdjustment { adjustmentPercentage }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type ProductResponse = {
  product: null | {
    title: string;
    handle: string;
    availableForSale: boolean;
    variants: { nodes: { id: string; price: Money }[] };
    sellingPlanGroups: {
      nodes: {
        sellingPlans: {
          nodes: { id: string; name: string; priceAdjustments: { adjustmentValue: { adjustmentPercentage?: number } }[] }[];
        };
      }[];
    };
  };
};

// Returns null when Shopify isn't configured, the product doesn't exist, or the request fails.
export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  if (!shopifyConfigured()) return null;
  try {
    const { product } = await storefront<ProductResponse>(PRODUCT_QUERY, { handle });
    const variant = product?.variants.nodes[0];
    if (!product || !variant) return null;
    return {
      title: product.title,
      handle: product.handle,
      availableForSale: product.availableForSale,
      variantId: variant.id,
      price: variant.price,
      sellingPlans: (product.sellingPlanGroups.nodes[0]?.sellingPlans.nodes ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        percentOff: p.priceAdjustments[0]?.adjustmentValue.adjustmentPercentage ?? null,
      })),
    };
  } catch (err) {
    console.error("[shopify] product fetch failed", handle, err);
    return null;
  }
}

// ── Cart ──────────────────────────────────────────────────

export type CartLine = {
  id: string;
  quantity: number;
  title: string;
  handle: string;
  image: string | null;
  plan: string | null;
  total: Money;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  subtotal: Money;
  lines: CartLine[];
};

export const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost { subtotalAmount { amount currencyCode } }
    lines(first: 50) {
      nodes {
        id
        quantity
        cost { totalAmount { amount currencyCode } }
        sellingPlanAllocation { sellingPlan { name } }
        merchandise {
          ... on ProductVariant {
            image { url }
            product { title handle featuredImage { url } }
          }
        }
      }
    }
  }
`;

export type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money };
  lines: {
    nodes: {
      id: string;
      quantity: number;
      cost: { totalAmount: Money };
      sellingPlanAllocation: { sellingPlan: { name: string } } | null;
      merchandise: { image: { url: string } | null; product: { title: string; handle: string; featuredImage: { url: string } | null } };
    }[];
  };
};

export function toCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    subtotal: raw.cost.subtotalAmount,
    lines: raw.lines.nodes.map((l) => ({
      id: l.id,
      quantity: l.quantity,
      title: l.merchandise.product.title,
      handle: l.merchandise.product.handle,
      image: l.merchandise.image?.url ?? l.merchandise.product.featuredImage?.url ?? null,
      plan: l.sellingPlanAllocation?.sellingPlan.name ?? null,
      total: l.cost.totalAmount,
    })),
  };
}
