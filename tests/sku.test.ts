/**
 * ⚠️  CRITICAL — PHYSICAL PACKAGING DEPENDENCY
 *
 * These tests lock in the SKU values printed on Crosps snack-bag QR codes.
 * If you change them and these tests start failing, STOP — the right move
 * is almost never to update the test, it's to revert the change.
 *
 * Read README.md → "⚠️ Critical: Physical packaging dependencies" before
 * touching anything in this file.
 *
 * The tests here cover the pure validation helper. The end-to-end behaviour
 * (URL → /api/feedback → Klaviyo profile + event) is locked in separately
 * by tests/api/feedback.test.ts.
 */

import { describe, it, expect } from "vitest";
import { VALID_SKUS, validateSku } from "@/lib/sku";

describe("VALID_SKUS — packaging-anchor constants", () => {
  it("matches the exact list printed on bags (do NOT loosen this)", () => {
    // If this assertion fails, you've changed a value that's encoded into
    // physical QR codes. Do not "fix" the test — fix the source.
    expect(VALID_SKUS).toEqual(["onion", "tomato", "pepper"]);
  });

  it("contains exactly three SKUs (current SKU range)", () => {
    expect(VALID_SKUS).toHaveLength(3);
  });
});

describe("validateSku()", () => {
  it.each([
    ["onion",  "onion"],
    ["tomato", "tomato"],
    ["pepper", "pepper"],
  ] as const)("accepts %s and returns %s", (input, expected) => {
    expect(validateSku(input)).toBe(expected);
  });

  it("returns null for an unknown SKU (whitelist enforcement)", () => {
    expect(validateSku("banana")).toBeNull();
  });

  it("returns null when no value is provided", () => {
    expect(validateSku(null)).toBeNull();
    expect(validateSku(undefined)).toBeNull();
    expect(validateSku("")).toBeNull();
  });

  it("returns null for non-string values", () => {
    expect(validateSku(42)).toBeNull();
    expect(validateSku({})).toBeNull();
    expect(validateSku([])).toBeNull();
    expect(validateSku(true)).toBeNull();
  });

  // ── Casing + whitespace normalisation ───────────────────────────
  // Input is trimmed and lowercased before the whitelist check. Printed
  // bags always send canonical lowercase, so this only affects hand-typed
  // / copy-pasted URLs — where capturing intent improves Klaviyo data.
  // The whitelist itself is unchanged: invalid values still return null.
  it.each([
    ["ONION",     "onion"],
    ["Onion",     "onion"],
    ["Tomato",    "tomato"],
    ["PEPPER",    "pepper"],
    [" onion",    "onion"],
    ["onion ",    "onion"],   // ?sku=onion%20 from a copy-paste
    ["  TOMATO ", "tomato"],
  ] as const)("normalises %j to %j", (input, expected) => {
    expect(validateSku(input)).toBe(expected);
  });

  it("still rejects invalid values after normalisation", () => {
    // Whitelist enforcement is what protects us — normalisation is only
    // there to forgive innocent typos, not to broaden the accepted set.
    expect(validateSku("banana")).toBeNull();
    expect(validateSku("BANANA")).toBeNull();
    expect(validateSku("Banana")).toBeNull();
    expect(validateSku(" banana ")).toBeNull();
  });
});
