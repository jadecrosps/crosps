/**
 * Klaviyo write logic for the /hi feedback flow.
 *
 * Extracted out of /api/feedback/route.ts so the same code path is shared
 * with scripts/replay-failures.ts. Returns a Result-typed value rather than
 * throwing, so callers can decide whether to fall back / retry.
 *
 * See README.md → "⚠️ Critical: Physical packaging dependencies" for the
 * surrounding contract.
 */

import { randomUUID } from "node:crypto";
import type { Sku } from "@/lib/sku";

const KLAVIYO_API = "https://a.klaviyo.com/api";
const KLAVIYO_REVISION = "2024-10-15";
const EVENT_NAME = "QR Scan Submitted";

export type FeedbackType = "improvement" | "almost_there" | "review";

/**
 * The full submission payload. This is the shape that gets persisted to
 * the fallback store on Klaviyo failure, so the replay script can rebuild
 * the exact same Klaviyo call later. Treat this as a stable on-disk format.
 */
export type SubmissionPayload = {
  email: string | null;
  rating: number | null;
  feedback_text: string;
  feedback_type: FeedbackType | null;
  sku: Sku | null;
  source: "qr-hi";
  submitted_at: string; // ISO timestamp
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: "missing_env"; missing: string[] }
  | { ok: false; reason: "api_error"; error: string };

export type KlaviyoEnv = {
  apiKey?: string;
  listId?: string;
};

/**
 * Submit a payload to Klaviyo. Never throws — returns a tagged result.
 */
export async function submitToKlaviyo(
  payload: SubmissionPayload,
  env: KlaviyoEnv = {
    apiKey: process.env.KLAVIYO_API_KEY,
    listId: process.env.KLAVIYO_LIST_ID,
  }
): Promise<SubmitResult> {
  const missing: string[] = [];
  if (!env.apiKey) missing.push("KLAVIYO_API_KEY");
  if (!env.listId) missing.push("KLAVIYO_LIST_ID");
  if (missing.length > 0) {
    return { ok: false, reason: "missing_env", missing };
  }

  const apiKey = env.apiKey!;
  const listId = env.listId!;

  // Klaviyo treats `properties` as opaque key/value bag — strip the
  // top-level `email` since that's an identifier, not a property.
  const properties = stripIdentifier(payload);

  try {
    if (payload.email) {
      await upsertProfile(apiKey, payload.email, properties);
      await subscribeToList(apiKey, listId, payload.email);
      await fireEvent(apiKey, { email: payload.email }, properties);
    } else {
      const externalId = `anon-${randomUUID()}`;
      await fireEvent(apiKey, { external_id: externalId }, properties);
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      reason: "api_error",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function stripIdentifier(payload: SubmissionPayload): Record<string, unknown> {
  const { email: _email, ...rest } = payload;
  return rest;
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
