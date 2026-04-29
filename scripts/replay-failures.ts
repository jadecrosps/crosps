#!/usr/bin/env tsx
/**
 * Replay /hi feedback submissions that couldn't reach Klaviyo when they
 * were originally submitted (because Klaviyo was down, returning 5xx, or
 * because env vars weren't set at the time).
 *
 * USAGE
 *   npm run replay-failures              # actually replay
 *   npm run replay-failures -- --dry-run # list what would be replayed, no writes
 *
 * REQUIRED ENV VARS (typically pulled from a Vercel deployment):
 *   KLAVIYO_API_KEY
 *   KLAVIYO_LIST_ID
 *   KV_REST_API_URL
 *   KV_REST_API_TOKEN
 *
 * Behaviour:
 *   - Reads every entry from the failed-submissions:* keyspace.
 *   - For each one, attempts submitToKlaviyo() with the original payload.
 *   - On success, deletes the KV entry. On failure, leaves it in place
 *     (so the next replay run will pick it up).
 *   - Prints a summary at the end. Exits non-zero if any entry failed.
 *
 * See README.md → "⚠️ Critical: Physical packaging dependencies"
 *               → "Recovering from a Klaviyo outage".
 */

import { listFailures, removeFailure, isConfigured } from "@/lib/fallback-store";
import { submitToKlaviyo } from "@/lib/klaviyo";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  if (!isConfigured()) {
    console.error(
      "❌ KV is not configured. Set KV_REST_API_URL and KV_REST_API_TOKEN " +
        "from your Vercel KV store before running this script.\n" +
        "   `vercel env pull .env.local` will populate them locally."
    );
    process.exit(1);
  }

  if (!process.env.KLAVIYO_API_KEY || !process.env.KLAVIYO_LIST_ID) {
    console.error(
      "❌ Klaviyo env vars missing. Set KLAVIYO_API_KEY and KLAVIYO_LIST_ID."
    );
    process.exit(1);
  }

  const entries = await listFailures();
  console.log(`Found ${entries.length} failed submission(s) in KV.\n`);

  if (entries.length === 0) {
    console.log("Nothing to replay. Exiting.");
    return;
  }

  if (DRY_RUN) {
    for (const { key, value } of entries) {
      console.log(`[dry-run] ${key}`);
      console.log(`          submitted_at=${value.payload.submitted_at}`);
      console.log(`          email=${value.payload.email ?? "<anon>"}`);
      console.log(`          rating=${value.payload.rating}`);
      console.log(`          sku=${value.payload.sku}`);
      console.log(`          original_failure=${value.failure.reason}`);
      console.log("");
    }
    console.log(
      `[dry-run] Would attempt to replay ${entries.length} submission(s). No writes.`
    );
    return;
  }

  let succeeded = 0;
  let failed = 0;

  for (const { key, value } of entries) {
    const result = await submitToKlaviyo(value.payload);
    if (result.ok) {
      await removeFailure(key);
      console.log(`✓ replayed and removed: ${key}`);
      succeeded++;
    } else {
      const detail =
        result.reason === "missing_env"
          ? `missing=${result.missing.join(",")}`
          : `error=${result.error}`;
      console.error(`✗ ${key} failed: reason=${result.reason} ${detail}`);
      failed++;
    }
  }

  console.log(`\n${succeeded} replayed, ${failed} still failing.`);

  if (failed > 0) {
    console.error(
      "\nSome entries are still failing. Re-run after the underlying issue " +
        "is fixed; the unsuccessful entries remain in KV."
    );
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
