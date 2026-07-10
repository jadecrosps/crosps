/**
 * GET /api/admin/failed-submissions
 *
 * Returns the list of /hi submissions that couldn't be delivered to
 * Klaviyo, persisted via src/lib/fallback-store.ts. This is the
 * recovery surface for a multi-day Klaviyo outage.
 *
 * Auth: pass a bearer token matching the ADMIN_API_TOKEN env var, e.g.
 *   curl -H "Authorization: Bearer $TOKEN" \
 *     https://eatcrosps.com/api/admin/failed-submissions
 *
 * For programmatic recovery, prefer the `npm run replay-failures` CLI —
 * it does the resending for you and deletes successful entries from KV.
 *
 * See README.md → "⚠️ Critical: Physical packaging dependencies"
 *               → "Recovering from a Klaviyo outage".
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { listFailures, isConfigured } from "@/lib/fallback-store";

export async function GET(req: NextRequest) {
  const authResult = checkAuth(req);
  if (!authResult.ok) {
    return NextResponse.json(
      { ok: false, error: authResult.reason },
      { status: 401 }
    );
  }

  if (!isConfigured()) {
    return NextResponse.json(
      { ok: false, error: "kv_unconfigured" },
      { status: 503 }
    );
  }

  try {
    const entries = await listFailures();
    return NextResponse.json({
      ok: true,
      count: entries.length,
      entries,
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: "kv_read_failed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

type AuthResult =
  | { ok: true }
  | { ok: false; reason: "no_token_configured" | "missing" | "invalid" };

function checkAuth(req: NextRequest): AuthResult {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    // Refuse to expose data if the admin token isn't set on the server
    // — this would otherwise let anyone with the URL read all failed
    // submissions, which contain emails and free-text feedback.
    return { ok: false, reason: "no_token_configured" };
  }

  const header = req.headers.get("authorization") ?? "";
  const match = /^Bearer (.+)$/.exec(header);
  if (!match) return { ok: false, reason: "missing" };

  if (!safeEqual(match[1], expected)) {
    return { ok: false, reason: "invalid" };
  }
  return { ok: true };
}

function safeEqual(a: string, b: string): boolean {
  // Constant-time comparison to avoid leaking token length / prefix via
  // response timing. Pad to the longer of the two so length mismatches
  // don't short-circuit.
  const max = Math.max(a.length, b.length);
  const ab = Buffer.alloc(max, 0);
  const bb = Buffer.alloc(max, 0);
  ab.write(a);
  bb.write(b);
  // Still need a length check at the end since timingSafeEqual on equal
  // padding always returns true if a is a prefix of b
  return timingSafeEqual(ab, bb) && a.length === b.length;
}
