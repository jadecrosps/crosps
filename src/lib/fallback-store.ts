/**
 * Persistent fallback for /api/feedback submissions that couldn't reach
 * Klaviyo (because Klaviyo is down, returning 5xx, or because env vars
 * aren't configured). Backed by Vercel KV.
 *
 * Design goals:
 *  - Zero data loss on Klaviyo failure (the user's stated goal).
 *  - Graceful degradation if KV ITSELF is unavailable: log loudly but
 *    don't throw, since blowing up here would also lose data.
 *  - Replayable: each entry is keyed by `failed-submissions:<ISO>-<uuid>`
 *    and the value is the full SubmissionPayload, so the replay script
 *    can rebuild the original Klaviyo call exactly.
 *
 * See README.md → "⚠️ Critical: Physical packaging dependencies".
 *
 * Environment variables (provisioned automatically when a Vercel KV /
 * Upstash store is connected to the project):
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 */

import { kv } from "@vercel/kv";
import { randomUUID } from "node:crypto";
import type { SubmissionPayload } from "@/lib/klaviyo";

export const KEY_PREFIX = "failed-submissions:";

export type FailureReason =
  | { reason: "missing_env"; missing: string[] }
  | { reason: "api_error"; error: string }
  | { reason: "unknown"; error: string };

export type StoredFailure = {
  payload: SubmissionPayload;
  failure: FailureReason;
  /** When the failure was recorded (may differ from payload.submitted_at). */
  recorded_at: string;
};

export type RecordResult =
  | { ok: true; key: string }
  | { ok: false; error: string };

/**
 * Persist a failed submission so it can be replayed later.
 *
 * Always returns a result — never throws. If KV is unconfigured or
 * unreachable we log loudly and return { ok: false } so the caller can
 * surface the situation in their own logs, but we DO NOT propagate the
 * error to the user-facing handler. Their flow must always succeed.
 */
export async function recordFailure(
  payload: SubmissionPayload,
  failure: FailureReason
): Promise<RecordResult> {
  if (!isConfigured()) {
    console.error(
      "[hi] fallback store unconfigured — submission will be lost",
      { payload, failure }
    );
    return { ok: false, error: "kv_unconfigured" };
  }

  const key = `${KEY_PREFIX}${payload.submitted_at}-${randomUUID()}`;
  const value: StoredFailure = {
    payload,
    failure,
    recorded_at: new Date().toISOString(),
  };

  try {
    await kv.set(key, value);
    return { ok: true, key };
  } catch (err) {
    // KV itself is broken. Log the full payload so it's at least in Vercel
    // logs for the (short) retention window. This is the last line of
    // defence; there is no further fallback.
    console.error("[hi] fallback store write failed — submission may be lost", {
      key,
      payload,
      failure,
      kv_error: err instanceof Error ? err.message : String(err),
    });
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * List all stored failures, newest first. Used by the admin endpoint and
 * the replay script.
 */
export async function listFailures(): Promise<
  Array<{ key: string; value: StoredFailure }>
> {
  if (!isConfigured()) {
    throw new Error("KV is not configured (KV_REST_API_URL / _TOKEN missing)");
  }

  // SCAN keys by prefix. Vercel KV exposes `scan` which returns [cursor, keys].
  const keys: string[] = [];
  let cursor: number | string = 0;
  do {
    const [next, batch] = (await kv.scan(cursor, {
      match: `${KEY_PREFIX}*`,
      count: 200,
    })) as [number | string, string[]];
    keys.push(...batch);
    cursor = next;
  } while (cursor !== 0 && cursor !== "0");

  if (keys.length === 0) return [];

  const values = (await kv.mget(...keys)) as Array<StoredFailure | null>;

  return keys
    .map((key, i) => ({ key, value: values[i] }))
    .filter((entry): entry is { key: string; value: StoredFailure } =>
      entry.value !== null
    )
    .sort((a, b) => (a.key < b.key ? 1 : -1)); // newest first by key
}

/**
 * Remove a stored failure. Used by the replay script after a successful
 * Klaviyo retry.
 */
export async function removeFailure(key: string): Promise<void> {
  if (!isConfigured()) {
    throw new Error("KV is not configured (KV_REST_API_URL / _TOKEN missing)");
  }
  await kv.del(key);
}

export function isConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}
