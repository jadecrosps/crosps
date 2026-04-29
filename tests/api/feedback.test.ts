/**
 * ⚠️  CRITICAL — PHYSICAL PACKAGING DEPENDENCY
 *
 * These tests lock in the exact payload shape sent to Klaviyo when a real
 * user scans a Crosps bag and submits feedback. They are the safety net
 * for the whole `/hi → /api/feedback → Klaviyo` data pipe.
 *
 * Read README.md → "⚠️ Critical: Physical packaging dependencies" before
 * relaxing or removing any of these assertions.
 *
 * What this file covers (the part not covered by tests/sku.test.ts):
 *   • The POST handler accepts the realistic body shape /hi sends.
 *   • The `sku` value flows verbatim into Klaviyo's profile properties.
 *   • The same `sku` value flows into the `QR Scan Submitted` event payload.
 *   • Invalid / missing SKU values land as null on both sides.
 *   • The Klaviyo API key, list id, and revision header are forwarded
 *     correctly (sanity, not the focus).
 *
 * Klaviyo is fully mocked here — these tests never call the real API.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/feedback/route";

const KLAVIYO_BASE = "https://a.klaviyo.com/api";

type FetchCall = [string, RequestInit];

function buildRequest(body: unknown): Request {
  return new Request("http://test.local/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** Find the fetch call whose URL contains the given fragment. */
function findCall(
  calls: FetchCall[],
  urlFragment: string
): { url: string; init: RequestInit; body: any } | undefined {
  const match = calls.find(([url]) => url.includes(urlFragment));
  if (!match) return undefined;
  const [url, init] = match;
  const body = init.body ? JSON.parse(init.body as string) : null;
  return { url, init, body };
}

describe("POST /api/feedback — SKU pass-through to Klaviyo", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv("KLAVIYO_API_KEY", "test-private-key");
    vi.stubEnv("KLAVIYO_LIST_ID", "test-list-id");

    // Default: every Klaviyo call succeeds. Tests that need to inspect
    // a specific response (e.g. 409 on profile create) override this.
    fetchMock = vi.fn(async (url: string) => {
      if (url.includes("/profiles/")) {
        return new Response(
          JSON.stringify({ data: { id: "test-profile-id" } }),
          { status: 201 }
        );
      }
      if (url.includes("/profile-subscription-bulk-create-jobs/")) {
        return new Response(null, { status: 202 });
      }
      if (url.includes("/events/")) {
        return new Response(null, { status: 202 });
      }
      return new Response(null, { status: 200 });
    });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  // ── The headline test cases the user asked for ─────────────────────────
  it.each([
    // Canonical printed-bag values — must always pass through verbatim
    ["onion",  "onion"],
    ["tomato", "tomato"],
    ["pepper", "pepper"],
    // Whitelist enforcement — invalid values land as null
    ["banana", null],
    ["BANANA", null],   // uppercase invalid: still rejected after normalisation
    [null,     null],   // no sku at all
    // Case + whitespace normalisation (see tests/sku.test.ts for the full
    // matrix). These prove normalisation flows all the way through to
    // Klaviyo — i.e. a hand-typed `?sku=ONION` lands as "onion" in both
    // the profile property and the event property, no data dropped.
    ["ONION",   "onion"],
    ["Onion",   "onion"],
    ["onion ",  "onion"],   // ?sku=onion%20
    [" tomato", "tomato"],
  ])(
    "sku=%s → klaviyo profile.properties.sku=%s AND event.properties.sku=%s",
    async (input, expected) => {
      const req = buildRequest({
        email: "scanner@example.com",
        rating: 5,
        feedback_text: "test",
        feedback_type: "review",
        sku: input,
      });

      const res = await POST(req as any);
      expect(res.status).toBe(200);

      const calls = fetchMock.mock.calls as FetchCall[];

      // 1. Profile upsert payload
      const profile = findCall(calls, "/profiles/");
      expect(profile, "expected a Klaviyo profile-upsert call").toBeDefined();
      expect(profile!.body.data.attributes.properties.sku).toBe(expected);

      // 2. Event payload
      const event = findCall(calls, "/events/");
      expect(event, "expected a QR Scan Submitted event call").toBeDefined();
      expect(event!.body.data.attributes.properties.sku).toBe(expected);
      expect(event!.body.data.attributes.metric.data.attributes.name).toBe(
        "QR Scan Submitted"
      );
    }
  );

  // ── Other shape assertions ─────────────────────────────────────────────
  it("forwards Klaviyo auth + revision headers on every call", async () => {
    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "tomato",
    });
    await POST(req as any);

    for (const [, init] of fetchMock.mock.calls as FetchCall[]) {
      const headers = init.headers as Record<string, string>;
      expect(headers["Authorization"]).toBe("Klaviyo-API-Key test-private-key");
      expect(headers["revision"]).toBe("2024-10-15");
    }
  });

  it("subscribes the email to KLAVIYO_LIST_ID", async () => {
    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "onion",
    });
    await POST(req as any);

    const sub = findCall(
      fetchMock.mock.calls as FetchCall[],
      "/profile-subscription-bulk-create-jobs/"
    );
    expect(sub).toBeDefined();
    expect(sub!.body.data.relationships.list.data.id).toBe("test-list-id");
  });

  it("anonymous submission still fires the event with the sku", async () => {
    const req = buildRequest({
      email: null,
      rating: 4,
      feedback_text: "anon",
      feedback_type: "review",
      sku: "pepper",
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);

    // Anonymous: no profile upsert, no list subscribe — just the event.
    const calls = fetchMock.mock.calls as FetchCall[];
    expect(findCall(calls, "/profiles/")).toBeUndefined();
    expect(
      findCall(calls, "/profile-subscription-bulk-create-jobs/")
    ).toBeUndefined();

    const event = findCall(calls, "/events/");
    expect(event).toBeDefined();
    expect(event!.body.data.attributes.properties.sku).toBe("pepper");
    // Identifier is a generated external_id rather than email
    expect(
      event!.body.data.attributes.profile.data.attributes.external_id
    ).toMatch(/^anon-/);
  });

  it("never throws to the client even when Klaviyo errors", async () => {
    // Override default mock to return 500 on profile create
    fetchMock.mockImplementation(async () => new Response("boom", { status: 500 }));

    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "tomato",
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
  });

  it("uses the documented Klaviyo base URL", async () => {
    // Lock in the API host so a future SDK swap can't silently change it.
    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "tomato",
    });
    await POST(req as any);
    for (const [url] of fetchMock.mock.calls as FetchCall[]) {
      expect(url.startsWith(`${KLAVIYO_BASE}/`)).toBe(true);
    }
  });
});
