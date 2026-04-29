/**
 * SKU validation for the /hi QR-code feedback flow.
 *
 * ⚠️  CRITICAL — PHYSICAL PACKAGING DEPENDENCY
 *
 * The string values in `VALID_SKUS` are **encoded into printed QR codes on
 * Crosps snack-bag packaging**. Changing them — including casing or spelling —
 * silently breaks every bag in circulation.
 *
 * If you find yourself wanting to add or rename a value here, read:
 *   - README.md → "⚠️ Critical: Physical packaging dependencies"
 *   - vercel.json.md (the redirect contract)
 *   - tests/sku.test.ts (these constants are locked in by automated tests
 *     that block deploys if changed)
 *
 * Casing / whitespace behaviour: input is trimmed and lowercased before
 * the whitelist check. Printed QR codes always send the canonical
 * lowercase form, so this only affects hand-typed or copy-pasted URLs —
 * where capturing intent (`?sku=ONION` → "onion") strictly improves
 * Klaviyo data accuracy. The whitelist itself is unchanged: invalid
 * values like "banana" or "BANANA" still return null.
 */

export const VALID_SKUS = ["onion", "tomato", "pepper"] as const;

export type Sku = (typeof VALID_SKUS)[number];

/**
 * Validate an unknown value (typically a URL search-param string) against
 * the printed-packaging SKU whitelist. Returns the SKU if valid, otherwise
 * null. Used by both the /hi client page (URL → form payload) and
 * /api/feedback (form payload → Klaviyo) so the pipeline is consistent.
 */
export function validateSku(value: unknown): Sku | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return (VALID_SKUS as readonly string[]).includes(normalized)
    ? (normalized as Sku)
    : null;
}
