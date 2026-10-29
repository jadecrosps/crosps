"use server";

import { headers } from "next/headers";
import { INBOX, sendEmail } from "@/lib/email";
import { findTradeCustomer, shopifyAdmin, shopifyAdminConfigured } from "@/lib/shopify-admin";
import { storefront } from "@/lib/shopify";
import { getTradeVariants } from "@/lib/trade";
import { TRADE, TRADE_FLAVOURS, totalCases, type TradeQuantities } from "@/lib/trade-terms";
import { endTradeSession, getTradeSession, linkToken } from "@/lib/trade-auth";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function origin() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "eatcrosps.com";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

// ── Login ────────────────────────────────────────

export type LinkState = { status: "idle" | "sent" | "not_approved" | "error"; email?: string; message?: string };

export async function requestTradeLink(_prev: LinkState, form: FormData): Promise<LinkState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return { status: "error", message: "Please enter a valid email address." };
  if (!shopifyAdminConfigured()) return { status: "error", message: "Trade login isn’t set up yet. Please email jade@eatcrosps.com." };
  try {
    const customer = await findTradeCustomer(email);
    if (!customer) return { status: "not_approved", email };
    const url = `${await origin()}/v2/trade/login?token=${linkToken({ email, name: customer.displayName || email, customerId: customer.id })}`;
    const sent = await sendEmail({
      to: email,
      from: "Crosps <website@eatcrosps.com>",
      subject: "Your Crosps trade login",
      text: `Hi ${customer.displayName || "there"},\n\nHere’s your link to log in to Crosps trade. It works for the next 15 minutes:\n\n${url}\n\nDidn’t ask for this? You can ignore this email.\n\nCrosps`,
    });
    return sent ? { status: "sent", email } : { status: "error", message: "We couldn’t send the email. Please try again." };
  } catch (err) {
    console.error("[trade] link request failed", err);
    return { status: "error", message: "Something went wrong. Please try again or email jade@eatcrosps.com." };
  }
}

export async function logoutTrade() {
  await endTradeSession();
}

// ── Ordering ─────────────────────────────────────

function clean(q: Partial<TradeQuantities>): TradeQuantities {
  const out = {} as TradeQuantities;
  for (const f of TRADE_FLAVOURS) {
    const n = Math.floor(Number(q[f.slug] ?? 0));
    out[f.slug] = Number.isFinite(n) ? Math.min(Math.max(n, 0), TRADE.maxCasesPerLine) : 0;
  }
  return out;
}

async function lines(q: TradeQuantities) {
  const variants = await getTradeVariants();
  return TRADE_FLAVOURS.filter((f) => q[f.slug] > 0).map((f) => {
    const v = variants[f.slug];
    if (!v) throw new Error(`Trade variant missing: ${f.handle}`);
    return { variantId: v.id, quantity: q[f.slug], name: f.name };
  });
}

export type OrderResult = { ok: true; url?: string } | { ok: false; error: string };

// Parcel-sized orders: a fresh Shopify cart (separate from the shopper basket) → checkout.
export async function tradeCheckout(raw: Partial<TradeQuantities>): Promise<OrderResult> {
  const session = await getTradeSession();
  if (!session) return { ok: false, error: "Please log in again." };
  const q = clean(raw);
  const cases = totalCases(q);
  if (cases < TRADE.minCases) return { ok: false, error: `Minimum order is ${TRADE.minCases} cases.` };
  if (cases >= TRADE.palletFrom) return { ok: false, error: "That’s a pallet order. Please request a pallet quote." };
  try {
    const items = await lines(q);
    const { cartCreate } = await storefront<{ cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] } }>(
      `mutation TradeCart($input: CartInput!) { cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } } }`,
      {
        input: {
          lines: items.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
          buyerIdentity: { email: session.email, countryCode: "GB" },
          note: `Trade order: ${session.name}`,
          attributes: [{ key: "Trade customer", value: `${session.name} <${session.email}>` }],
        },
      },
    );
    if (!cartCreate.cart) throw new Error(cartCreate.userErrors.map((e) => e.message).join("; "));
    return { ok: true, url: cartCreate.cart.checkoutUrl };
  } catch (err) {
    console.error("[trade] checkout failed", err);
    return { ok: false, error: "Something went wrong. Please try again or email jade@eatcrosps.com." };
  }
}

// Pallet-sized orders: a Shopify draft order for Jade to add delivery to and invoice.
export async function requestPalletQuote(raw: Partial<TradeQuantities>, details: Record<string, string>): Promise<OrderResult> {
  const session = await getTradeSession();
  if (!session) return { ok: false, error: "Please log in again." };
  const q = clean(raw);
  const cases = totalCases(q);
  if (cases < TRADE.palletFrom) return { ok: false, error: "That order ships by parcel. Please use checkout." };
  const address1 = details.address1?.trim();
  const city = details.city?.trim();
  const zip = details.postcode?.trim();
  if (!address1 || !city || !zip) return { ok: false, error: "Please add the delivery address and postcode." };
  const notes = details.notes?.trim();
  try {
    const items = await lines(q);
    const { draftOrderCreate } = await shopifyAdmin<{
      draftOrderCreate: { draftOrder: { id: string; name: string } | null; userErrors: { message: string }[] };
    }>(
      `mutation PalletDraft($input: DraftOrderInput!) { draftOrderCreate(input: $input) { draftOrder { id name } userErrors { message } } }`,
      {
        input: {
          purchasingEntity: { customerId: session.customerId },
          email: session.email,
          lineItems: items.map((l) => ({ variantId: l.variantId, quantity: l.quantity })),
          shippingAddress: { company: session.name, address1, address2: details.address2?.trim() || undefined, city, zip, countryCode: "GB", phone: details.phone?.trim() || undefined },
          note: `Pallet quote request (${cases} cases). Add pallet delivery as custom shipping, then Send invoice.${notes ? `\n\nFrom the customer: ${notes}` : ""}`,
          tags: ["trade", "pallet-quote"],
        },
      },
    );
    const draft = draftOrderCreate.draftOrder;
    if (!draft) throw new Error(draftOrderCreate.userErrors.map((e) => e.message).join("; "));

    const store = process.env.SHOPIFY_STORE_DOMAIN?.split(".")[0];
    const adminUrl = `https://admin.shopify.com/store/${store}/draft_orders/${draft.id.split("/").pop()}`;
    const summary = items.map((l) => `  ${l.quantity} × ${l.name}`).join("\n");
    const address = [address1, details.address2?.trim(), city, zip].filter(Boolean).join(", ");
    await Promise.all([
      sendEmail({
        to: INBOX,
        replyTo: session.email,
        subject: `New pallet request from ${session.name} (${cases} cases)`,
        text: `${session.name} (${session.email}) wants ${cases} cases delivered by pallet.\n\n${summary}\n\nDeliver to: ${address}${details.phone ? `\nPhone: ${details.phone}` : ""}${notes ? `\nNotes: ${notes}` : ""}\n\nDraft order ${draft.name}: add the pallet delivery price as custom shipping, then click Send invoice.\n${adminUrl}`,
      }),
      sendEmail({
        to: session.email,
        from: "Crosps <website@eatcrosps.com>",
        replyTo: INBOX,
        subject: "We’ve got your pallet request",
        text: `Hi ${session.name},\n\nThanks for your order of ${cases} cases:\n\n${summary}\n\nDeliver to: ${address}\n\nWe’ll email you a delivery price and a payment link within one working day. Nothing is charged until you pay.\n\nCrosps`,
      }),
    ]);
    return { ok: true };
  } catch (err) {
    console.error("[trade] pallet request failed", err);
    return { ok: false, error: "Something went wrong. Please try again or email jade@eatcrosps.com." };
  }
}
