import { NextRequest, NextResponse } from "next/server";
import { validateSku } from "@/lib/sku";
import {
  submitToKlaviyo,
  type FeedbackType,
  type SubmissionPayload,
} from "@/lib/klaviyo";
import { recordFailure } from "@/lib/fallback-store";

/**
 * POST /api/feedback
 *
 * Receives a /hi feedback flow submission and writes it to Klaviyo.
 *   - Returns 200 to the client unconditionally (the user's flow must
 *     never break, even if Klaviyo or our infra is unavailable).
 *   - On any Klaviyo failure (down, 5xx, env vars missing), the full
 *     submission is persisted to the Vercel KV fallback store so the
 *     replay script can resend it later.
 *
 * Env vars (set in Vercel):
 *   KLAVIYO_API_KEY    — Klaviyo private API key (server-only)
 *   KLAVIYO_LIST_ID    — ID of the "QR Scanners — Pre-launch" list
 *   KV_REST_API_URL    — auto-set when KV is connected to the project
 *   KV_REST_API_TOKEN  — auto-set when KV is connected to the project
 *
 * See README.md → "⚠️ Critical: Physical packaging dependencies".
 */

type Body = {
  email?: string | null;
  rating?: number;
  feedback_text?: string;
  feedback_type?: FeedbackType;
  sku?: string | null;
};

export async function POST(req: NextRequest) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload: SubmissionPayload = {
    email: body.email ?? null,
    rating: typeof body.rating === "number" ? body.rating : null,
    feedback_text: body.feedback_text ?? "",
    feedback_type: body.feedback_type ?? null,
    // Defensive: re-validate server-side (client params can be tampered with)
    sku: validateSku(body.sku),
    source: "qr-hi",
    submitted_at: new Date().toISOString(),
  };

  const result = await submitToKlaviyo(payload);

  if (!result.ok) {
    console.error("[hi] Klaviyo submission failed — persisting to fallback", {
      reason: result.reason,
      ...(result.reason === "missing_env" ? { missing: result.missing } : {}),
      ...(result.reason === "api_error" ? { error: result.error } : {}),
      payload,
    });

    const failure =
      result.reason === "missing_env"
        ? { reason: "missing_env" as const, missing: result.missing }
        : { reason: "api_error" as const, error: result.error };

    await recordFailure(payload, failure);
  }

  // The user's flow always succeeds.
  return NextResponse.json({ ok: true });
}
