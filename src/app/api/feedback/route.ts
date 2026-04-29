import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { validateSku, type Sku } from "@/lib/sku";

/**
 * POST /api/feedback
 *
 * Receives the QR feedback flow submission and writes it to Klaviyo:
 *   1. If email present → upsert profile w/ properties → bulk-subscribe to list
 *   2. Always → fire "QR Scan Submitted" metric event with the same properties
 *      (anonymous events use a generated external_id so we don't lose data)
 *
 * Behaviour requirements:
 *  - Always return 200 to the client. The user's flow must never break,
 *    even if Klaviyo errors. Failures are logged so data can be recovered.
 *
 * Env vars (set in Vercel):
 *   KLAVIYO_API_KEY  — Klaviyo private API key (server-only)
 *   KLAVIYO_LIST_ID  — ID of the "QR Scanners — Pre-launch" list
 */

const KLAVIYO_API = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";
const EVENT_NAME = "QR Scan Submitted";

type FeedbackType = "improvement" | "almost_there" | "review";

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

  const { email, rating, feedback_text, feedback_type, sku } = body;

  // Defensive: re-validate server-side (client can be tampered with)
  const validSku: Sku | null = validateSku(sku);

  const submittedAt = new Date().toISOString();
  const properties = {
    rating: typeof rating === "number" ? rating : null,
    feedback_text: feedback_text ?? "",
    feedback_type: feedback_type ?? null,
    sku: validSku,
    source: "qr-hi",
    submitted_at: submittedAt,
  };

  const apiKey = process.env.KLAVIYO_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId) {
    console.error("[hi] Klaviyo env vars not configured", {
      hasKey: !!apiKey,
      hasList: !!listId,
      email: email ?? null,
      properties,
    });
    return NextResponse.json({ ok: true });
  }

  // Run Klaviyo work, but never fail the response
  try {
    if (email) {
      // Identified user — upsert profile, subscribe, fire event
      await upsertProfile(apiKey, email, properties);
      await subscribeToList(apiKey, listId, email);
      await fireEvent(apiKey, { email }, properties);
    } else {
      // Anonymous — fire event with a generated external_id so it lands somewhere
      const externalId = `anon-${randomUUID()}`;
      await fireEvent(apiKey, { external_id: externalId }, properties);
    }
  } catch (err) {
    console.error("[hi] Klaviyo submission failed", {
      email: email ?? null,
      properties,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  return NextResponse.json({ ok: true });
}

/* ── Klaviyo helpers ─────────────────────────────────────── */

async function upsertProfile(
  apiKey: string,
  email: string,
  properties: Record<string, unknown>
): Promise<string | null> {
  const headers = klaviyoHeaders(apiKey);

  const createRes = await fetch(`${KLAVIYO_API}/profiles/`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      data: {
        type: "profile",
        attributes: { email, properties },
      },
    }),
  });

  if (createRes.status === 201) {
    const data = (await createRes.json()) as { data?: { id?: string } };
    return data.data?.id ?? null;
  }

  if (createRes.status === 409) {
    // Profile already exists — extract id and PATCH it
    const data = (await createRes.json()) as {
      errors?: Array<{ meta?: { duplicate_profile_id?: string } }>;
    };
    const profileId = data.errors?.[0]?.meta?.duplicate_profile_id;
    if (!profileId) {
      throw new Error("409 conflict but no duplicate_profile_id returned");
    }

    const patchRes = await fetch(`${KLAVIYO_API}/profiles/${profileId}/`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        data: {
          type: "profile",
          id: profileId,
          attributes: { properties },
        },
      }),
    });

    if (!patchRes.ok) {
      const text = await patchRes.text();
      throw new Error(`PATCH profile failed: ${patchRes.status} ${text}`);
    }

    return profileId;
  }

  const text = await createRes.text();
  throw new Error(`POST profile failed: ${createRes.status} ${text}`);
}

async function subscribeToList(
  apiKey: string,
  listId: string,
  email: string
): Promise<void> {
  const res = await fetch(
    `${KLAVIYO_API}/profile-subscription-bulk-create-jobs/`,
    {
      method: "POST",
      headers: klaviyoHeaders(apiKey),
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: {
                    email,
                    subscriptions: {
                      email: {
                        marketing: { consent: "SUBSCRIBED" },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: { type: "list", id: listId },
            },
          },
        },
      }),
    }
  );

  // 202 Accepted on success; treat 409 as "already subscribed" (rare)
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    throw new Error(`Subscribe failed: ${res.status} ${text}`);
  }
}

type ProfileIdentifier =
  | { email: string; external_id?: never }
  | { email?: never; external_id: string };

async function fireEvent(
  apiKey: string,
  identifier: ProfileIdentifier,
  properties: Record<string, unknown>
): Promise<void> {
  const profileAttributes: Record<string, unknown> = identifier.email
    ? { email: identifier.email }
    : { external_id: identifier.external_id };

  const res = await fetch(`${KLAVIYO_API}/events/`, {
    method: "POST",
    headers: klaviyoHeaders(apiKey),
    body: JSON.stringify({
      data: {
        type: "event",
        attributes: {
          properties,
          metric: {
            data: {
              type: "metric",
              attributes: { name: EVENT_NAME },
            },
          },
          profile: {
            data: {
              type: "profile",
              attributes: profileAttributes,
            },
          },
        },
      },
    }),
  });

  // 202 Accepted on success
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Event failed: ${res.status} ${text}`);
  }
}

function klaviyoHeaders(apiKey: string): HeadersInit {
  return {
    Authorization: `Klaviyo-API-Key ${apiKey}`,
    revision: KLAVIYO_REVISION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}
