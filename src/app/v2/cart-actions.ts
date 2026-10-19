"use server";

import { cookies } from "next/headers";
import { CART_FIELDS, shopifyConfigured, storefront, toCart, type Cart, type RawCart } from "@/lib/shopify";

// Cart server actions for the V2 pages. The Shopify cart id lives in a cookie;
// checkout itself happens on Shopify's hosted checkout (cart.checkoutUrl).

const COOKIE = "crosps_cart";

export type CartResult = { ok: true; cart: Cart | null } | { ok: false; error: "not_configured" | "failed" };

async function cartId() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

async function remember(cart: Cart) {
  (await cookies()).set(COOKIE, cart.id, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 14 });
}

async function run(fn: () => Promise<Cart | null>): Promise<CartResult> {
  if (!shopifyConfigured()) return { ok: false, error: "not_configured" };
  try {
    return { ok: true, cart: await fn() };
  } catch (err) {
    console.error("[cart]", err);
    return { ok: false, error: "failed" };
  }
}

export async function getCart(): Promise<CartResult> {
  return run(async () => {
    const id = await cartId();
    if (!id) return null;
    const { cart } = await storefront<{ cart: RawCart | null }>(
      `query Cart($id: ID!) { cart(id: $id) { ...CartFields } } ${CART_FIELDS}`,
      { id },
    );
    return cart ? toCart(cart) : null;
  });
}

export async function addToCart(variantId: string, quantity: number, sellingPlanId?: string): Promise<CartResult> {
  return run(async () => {
    const line = { merchandiseId: variantId, quantity, ...(sellingPlanId ? { sellingPlanId } : {}) };
    const id = await cartId();
    if (id) {
      const { cartLinesAdd } = await storefront<{ cartLinesAdd: { cart: RawCart | null } }>(
        `mutation Add($id: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $id, lines: $lines) { cart { ...CartFields } } } ${CART_FIELDS}`,
        { id, lines: [line] },
      );
      if (cartLinesAdd.cart) return toCart(cartLinesAdd.cart);
    }
    // No cart yet (or it expired): start a new one.
    const { cartCreate } = await storefront<{ cartCreate: { cart: RawCart } }>(
      `mutation Create($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ...CartFields } } } ${CART_FIELDS}`,
      { lines: [line] },
    );
    const cart = toCart(cartCreate.cart);
    await remember(cart);
    return cart;
  });
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  return run(async () => {
    const id = await cartId();
    if (!id) return null;
    if (quantity <= 0) {
      const { cartLinesRemove } = await storefront<{ cartLinesRemove: { cart: RawCart } }>(
        `mutation Remove($id: ID!, $ids: [ID!]!) { cartLinesRemove(cartId: $id, lineIds: $ids) { cart { ...CartFields } } } ${CART_FIELDS}`,
        { id, ids: [lineId] },
      );
      return toCart(cartLinesRemove.cart);
    }
    const { cartLinesUpdate } = await storefront<{ cartLinesUpdate: { cart: RawCart } }>(
      `mutation Update($id: ID!, $lines: [CartLineUpdateInput!]!) { cartLinesUpdate(cartId: $id, lines: $lines) { cart { ...CartFields } } } ${CART_FIELDS}`,
      { id, lines: [{ id: lineId, quantity }] },
    );
    return toCart(cartLinesUpdate.cart);
  });
}
