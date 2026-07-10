/**
 * Tests for the admin recovery endpoint.
 *
 * These guard the auth gate: the failed-submissions store contains
 * scanned-bag feedback (free-text + emails), so a misconfiguration that
 * leaves it readable to the public would be a privacy incident.
 *
 * See README.md → "⚠️ Critical: Physical packaging dependencies"
 *               → "Recovering from a Klaviyo outage".
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

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

import { GET } from "@/app/api/admin/failed-submissions/route";

function get(url = "http://test.local/api/admin/failed-submissions", token?: string) {
  return new Request(url, {
    method: "GET",
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
}

describe("GET /api/admin/failed-submissions — auth", () => {
  beforeEach(() => {
    vi.stubEnv("KV_REST_API_URL", "https://kv.test");
    vi.stubEnv("KV_REST_API_TOKEN", "kv-test-token");
    kvMock.scan.mockClear();
    kvMock.mget.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("refuses requests when ADMIN_API_TOKEN is not set on the server", async () => {
    vi.stubEnv("ADMIN_API_TOKEN", "");
    const res = await GET(get(undefined, "anything") as any);
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.error).toBe("no_token_configured");
  });

  it("refuses requests with no Authorization header", async () => {
    vi.stubEnv("ADMIN_API_TOKEN", "secret-token-1234");
    const res = await GET(get() as any);
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("missing");
  });

  it("refuses requests with the wrong token", async () => {
    vi.stubEnv("ADMIN_API_TOKEN", "secret-token-1234");
    const res = await GET(get(undefined, "wrong-token") as any);
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("invalid");
  });

  it("refuses a token that is a prefix of the real one (constant-time check)", async () => {
    // This catches a class of subtle bugs where a naive `startsWith` or
    // length-mismatch shortcut would accept partial matches.
    vi.stubEnv("ADMIN_API_TOKEN", "secret-token-1234");
    const res = await GET(get(undefined, "secret-token") as any);
    expect(res.status).toBe(401);
  });

  it("accepts a correct token and returns the entries", async () => {
    vi.stubEnv("ADMIN_API_TOKEN", "secret-token-1234");
    kvMock.scan.mockResolvedValueOnce([
      0,
      ["failed-submissions:2026-01-01T00:00:00Z-aaaa"],
    ] as [number, string[]]);
    kvMock.mget.mockResolvedValueOnce([
      {
        payload: {
          email: "x@example.com",
          rating: 5,
          feedback_text: "love",
          feedback_type: "review",
          sku: "onion",
          source: "qr-hi",
          submitted_at: "2026-01-01T00:00:00Z",
        },
        failure: { reason: "api_error", error: "Klaviyo 500" },
        recorded_at: "2026-01-01T00:00:01Z",
      },
    ]);

    const res = await GET(get(undefined, "secret-token-1234") as any);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.count).toBe(1);
    expect(body.entries[0].value.payload.sku).toBe("onion");
  });
});

describe("GET /api/admin/failed-submissions — KV unavailable", () => {
  beforeEach(() => {
    vi.stubEnv("ADMIN_API_TOKEN", "secret-token-1234");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 503 when KV is unconfigured", async () => {
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    const res = await GET(get(undefined, "secret-token-1234") as any);
    expect(res.status).toBe(503);
    expect((await res.json()).error).toBe("kv_unconfigured");
  });
});
