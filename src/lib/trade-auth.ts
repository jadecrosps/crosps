import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Shared trade password (TRADE_PASSWORD env var). Unlocking stores a hash of it in a
// cookie, so changing the password logs every stockist out.

export const TRADE_COOKIE = "crosps_trade";

export function tradeToken(password = process.env.TRADE_PASSWORD) {
  return password ? createHash("sha256").update(`crosps-trade:${password}`).digest("hex") : null;
}

export function sameSecret(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function isTradeUnlocked() {
  const expected = tradeToken();
  const got = (await cookies()).get(TRADE_COOKIE)?.value;
  return !!expected && !!got && sameSecret(got, expected);
}
