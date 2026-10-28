"use server";

import { cookies } from "next/headers";
import { CART_FIELDS, shopifyConfigured, storefront, toCart, type Cart, type RawCart } from "@/lib/shopify";

// Cart server actions for the V2 pages. The Shopify cart id lives in a cookie;
// checkout itself happens on Shopify's hosted checkout (cart.checkoutUrl).

const COOKIE = "crosps_cart";

export type CartResult = { ok: true; cart: Cart | null } | { ok: false; error: "not_configured" | "failed" | "sold_out" };

class SoldOut extends Error {}

type Warning = { code: string };

function checkWarnings(warnings: Warning[] | undefined) {
  if (warnings?.some((w) => w.code === "MERCHANDISE_OUT_OF_STOCK" || w.code === "MERCHANDISE_NOT_ENOUGH_STOCK")) throw new SoldOut();
}

async function cartId() {
  return (await cookies()).get(COOKIE)?.value ?? null;
}

async function remember(cart: Cart) {
  (await cookies()).set(COOKIE, cart.id, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 14 });
}

async function run(fn: () => Promise<Cart | null>): Promise<CartResult> {
  if (!shopifyConfigured()) return { ok: false, error: "not_configured" };
  try {
    return { ok: true, cart: await fn() };
  } catch (err) {
    if (err instanceof SoldOut) return { ok: false, error: "sold_out" };
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
      const { cartLinesAdd } = await storefront<{ cartLinesAdd: { cart: RawCart | null; warnings: Warning[] } }>(
        `mutation Add($id: ID!, $lines: [CartLineInput!]!) { cartLinesAdd(cartId: $id, lines: $lines) { cart { ...CartFields } warnings { code } } } ${CART_FIELDS}`,
        { id, lines: [line] },
      );
      checkWarnings(cartLinesAdd.warnings);
      if (cartLinesAdd.cart) return toCart(cartLinesAdd.cart);
    }
    // No cart yet (or it expired): start a new one.
    const { cartCreate } = await storefront<{ cartCreate: { cart: RawCart; warnings: Warning[] } }>(
      `mutation Create($lines: [CartLineInput!]) { cartCreate(input: { lines: $lines }) { cart { ...CartFields } warnings { code } } } ${CART_FIELDS}`,
      { lines: [line] },
    );
    checkWarnings(cartCreate.warnings);
    const cart = toCart(cartCreate.cart);
    await remember(cart);
    return cart;
  });
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  return run(async () => {
    const id = await cartId();
    // Without the cookie we can't reach the cart; fail rather than show it as emptied.
    if (!id) throw new Error("No cart cookie");
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
