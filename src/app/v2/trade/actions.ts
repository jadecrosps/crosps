"use server";

import { cookies } from "next/headers";
import { TRADE_COOKIE, sameSecret, tradeToken } from "@/lib/trade-auth";

export type UnlockState = { error: string | null };

export async function unlockTrade(_prev: UnlockState, form: FormData): Promise<UnlockState> {
  const expected = tradeToken();
  if (!expected) return { error: "Trade access isn’t set up yet. Please email jade@eatcrosps.com." };
  const given = tradeToken(String(form.get("password") ?? "").trim());
  if (!given || !sameSecret(given, expected)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return { error: "That password isn’t right. Check your trade welcome email, or apply below." };
  }
  (await cookies()).set(TRADE_COOKIE, expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return { error: null };
}

export async function lockTrade() {
  (await cookies()).delete(TRADE_COOKIE);
}
