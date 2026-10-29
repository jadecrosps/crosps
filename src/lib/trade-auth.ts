import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findTradeCustomer } from "./shopify-admin";

// Per-shop trade login. A stockist is any Shopify customer tagged "trade".
// They log in with a signed email link (15 minutes), which sets a signed session
// cookie (30 days). Every check re-asks Shopify for the tag, so removing "trade"
// from a customer ends their access straight away.

export const TRADE_COOKIE = "crosps_trade";
const LINK_TTL = 15 * 60 * 1000;
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000;

export type TradeSession = { email: string; name: string; customerId: string };
type Payload = TradeSession & { kind: "link" | "session"; exp: number };

function secret() {
  const s = process.env.TRADE_SESSION_SECRET ?? process.env.SHOPIFY_CLIENT_SECRET;
  if (!s) throw new Error("No trade signing secret configured");
  return s;
}

function sign(payload: Payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const mac = createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${mac}`;
}

function verify(token: string | undefined, kind: Payload["kind"]): TradeSession | null {
  if (!token) return null;
  const [body, mac] = token.split(".");
  if (!body || !mac) return null;
  const expected = createHmac("sha256", secret()).update(body).digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const p = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (p.kind !== kind || Date.now() > p.exp) return null;
    return { email: p.email, name: p.name, customerId: p.customerId };
  } catch {
    return null;
  }
}

export const linkToken = (s: TradeSession) => sign({ ...s, kind: "link", exp: Date.now() + LINK_TTL });
export const verifyLinkToken = (token: string | undefined) => verify(token, "link");

export async function startTradeSession(s: TradeSession) {
  (await cookies()).set(TRADE_COOKIE, sign({ ...s, kind: "session", exp: Date.now() + SESSION_TTL }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL / 1000,
  });
}

export async function endTradeSession() {
  (await cookies()).delete(TRADE_COOKIE);
}

// The logged-in stockist, or null. Confirms the customer is still tagged "trade".
export async function getTradeSession(): Promise<TradeSession | null> {
  let session: TradeSession | null;
  try {
    session = verify((await cookies()).get(TRADE_COOKIE)?.value, "session");
  } catch {
    return null;
  }
  if (!session) return null;
  try {
    const customer = await findTradeCustomer(session.email);
    return customer ? { ...session, name: customer.displayName || session.name } : null;
  } catch (err) {
    console.error("[trade] tag check failed", err);
    return null;
  }
}
