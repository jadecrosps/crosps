/**
 * ⚠️  CRITICAL — PHYSICAL PACKAGING DEPENDENCY
 *
 * These tests lock in the exact payload shape sent to Klaviyo when a real
 * user scans a Crosps bag and submits feedback, AND the behaviour of the
 * Vercel KV fallback when Klaviyo can't be reached. They are the safety
 * net for the whole `/hi → /api/feedback → Klaviyo (+ KV fallback)` data
 * pipe.
 *
 * Read README.md → "⚠️ Critical: Physical packaging dependencies" before
 * relaxing or removing any of these assertions.
 *
 * Both Klaviyo and Vercel KV are fully mocked here — these tests never
 * call real services.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── Mock Vercel KV before importing the route ──────────────────────────
// vi.mock() is hoisted above imports, so the mock factory can't reference
// module-level variables. vi.hoisted() lets us share the spies safely.
const { kvMock } = vi.hoisted(() => ({
  kvMock: {
    set: vi.fn(async () => "OK"),
    get: vi.fn(async () => null),
    del: vi.fn(async () => 1),
    scan: vi.fn(async () => [0, []] as [number, string[]]),
    mget: vi.fn(async () => []),
  },
}));

vi.mock("@vercel/kv", () => ({ kv: kvMock }));

import { POST } from "@/app/api/feedback/route";
import { KEY_PREFIX } from "@/lib/fallback-store";

const KLAVIYO_BASE = "https://a.klaviyo.com/api";

type FetchCall = [string, RequestInit];

function buildRequest(body: unknown): Request {
  return new Request("http://test.local/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

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

describe("POST /api/feedback — happy path: SKU pass-through to Klaviyo", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv("KLAVIYO_API_KEY", "test-private-key");
    vi.stubEnv("KLAVIYO_LIST_ID", "test-list-id");
    vi.stubEnv("KV_REST_API_URL", "https://kv.test");
    vi.stubEnv("KV_REST_API_TOKEN", "kv-test-token");

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

    // Reset KV mock spies between tests
    kvMock.set.mockClear();
    kvMock.get.mockClear();
    kvMock.del.mockClear();
    kvMock.scan.mockClear();
    kvMock.mget.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  // ── The headline test cases ────────────────────────────────────────────
  it.each([
    // Canonical printed-bag values — must always pass through verbatim
    ["onion",  "onion"],
    ["tomato", "tomato"],
    ["pepper", "pepper"],
    // Whitelist enforcement — invalid values land as null
    ["banana", null],
    ["BANANA", null],
    [null,     null],
    // Trim + lowercase normalisation — see tests/sku.test.ts for the matrix.
    ["ONION",   "onion"],
    ["Onion",   "onion"],
    ["onion ",  "onion"],
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

      const profile = findCall(calls, "/profiles/");
      expect(profile, "expected a Klaviyo profile-upsert call").toBeDefined();
      expect(profile!.body.data.attributes.properties.sku).toBe(expected);

      const event = findCall(calls, "/events/");
      expect(event, "expected a QR Scan Submitted event call").toBeDefined();
      expect(event!.body.data.attributes.properties.sku).toBe(expected);
      expect(event!.body.data.attributes.metric.data.attributes.name).toBe(
        "QR Scan Submitted"
      );

      // On a happy path nothing is written to KV
      expect(kvMock.set).not.toHaveBeenCalled();
    }
  );

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

    const calls = fetchMock.mock.calls as FetchCall[];
    expect(findCall(calls, "/profiles/")).toBeUndefined();
    expect(
      findCall(calls, "/profile-subscription-bulk-create-jobs/")
    ).toBeUndefined();

    const event = findCall(calls, "/events/");
    expect(event).toBeDefined();
    expect(event!.body.data.attributes.properties.sku).toBe("pepper");
    expect(
      event!.body.data.attributes.profile.data.attributes.external_id
    ).toMatch(/^anon-/);
  });

  it("uses the documented Klaviyo base URL", async () => {
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

// ──────────────────────────────────────────────────────────────────────────
//  Fallback-store behaviour: zero-data-loss design goal
// ──────────────────────────────────────────────────────────────────────────

describe("POST /api/feedback — fallback to Vercel KV on Klaviyo failure", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv("KLAVIYO_API_KEY", "test-private-key");
    vi.stubEnv("KLAVIYO_LIST_ID", "test-list-id");
    vi.stubEnv("KV_REST_API_URL", "https://kv.test");
    vi.stubEnv("KV_REST_API_TOKEN", "kv-test-token");

    kvMock.set.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("captures the full payload in KV when Klaviyo returns 500", async () => {
    fetchMock = vi.fn(async () => new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const req = buildRequest({
      email: "scanner@example.com",
      rating: 2,
      feedback_text: "saltier please",
      feedback_type: "improvement",
      sku: "tomato",
    });

    const res = await POST(req as any);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });

    // The user's flow succeeded, AND we captured the payload to KV
    expect(kvMock.set).toHaveBeenCalledOnce();
    const [key, value] = kvMock.set.mock.calls[0];
    expect(key).toMatch(new RegExp(`^${KEY_PREFIX}\\d{4}-\\d{2}-\\d{2}T`));
    expect(value).toMatchObject({
      payload: {
        email: "scanner@example.com",
        rating: 2,
        feedback_text: "saltier please",
        feedback_type: "improvement",
        sku: "tomato",
        source: "qr-hi",
      },
      failure: { reason: "api_error" },
    });
    // recorded_at is set by the store, not the caller
    expect((value as any).recorded_at).toMatch(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
    );
  });

  it("captures the payload in KV when KLAVIYO env vars are missing", async () => {
    vi.stubEnv("KLAVIYO_API_KEY", "");
    vi.stubEnv("KLAVIYO_LIST_ID", "");
    vi.stubGlobal("fetch", vi.fn());

    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "onion",
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);

    expect(kvMock.set).toHaveBeenCalledOnce();
    const [, value] = kvMock.set.mock.calls[0];
    expect(value).toMatchObject({
      failure: {
        reason: "missing_env",
        missing: expect.arrayContaining(["KLAVIYO_API_KEY", "KLAVIYO_LIST_ID"]),
      },
    });
  });

  it("captures anonymous (no-email) submissions to KV when Klaviyo errors", async () => {
    fetchMock = vi.fn(async () => new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const req = buildRequest({
      email: null,
      rating: 3,
      feedback_text: "hmm",
      feedback_type: "almost_there",
      sku: "pepper",
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);

    expect(kvMock.set).toHaveBeenCalledOnce();
    const [, value] = kvMock.set.mock.calls[0];
    expect((value as any).payload.email).toBeNull();
    expect((value as any).payload.sku).toBe("pepper");
  });

  it("validated SKU lands in the fallback payload (not the raw client value)", async () => {
    fetchMock = vi.fn(async () => new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);

    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "ONION", // normalised by validateSku
    });
    await POST(req as any);

    const [, value] = kvMock.set.mock.calls[0];
    expect((value as any).payload.sku).toBe("onion");
  });

  it("never throws to the user even when KV itself is also down", async () => {
    fetchMock = vi.fn(async () => new Response("boom", { status: 500 }));
    vi.stubGlobal("fetch", fetchMock);
    kvMock.set.mockRejectedValueOnce(new Error("KV exploded"));

    const req = buildRequest({
      email: "scanner@example.com",
      rating: 5,
      feedback_text: "",
      feedback_type: "review",
      sku: "tomato",
    });
    const res = await POST(req as any);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    // KV.set was attempted (and rejected); we don't infinitely loop
    expect(kvMock.set).toHaveBeenCalledTimes(1);
  });
});
