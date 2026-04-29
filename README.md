This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## ⚠️ Critical: Physical packaging dependencies

**Read this before touching `/hi` or anything related to it.**

The `/hi` route (`src/app/hi/page.tsx`) is the destination for QR codes
**printed on physical Crosps snack-bag packaging**. Every bag in circulation
points here. Bags are already in retailers, in customers' hands, on shelves
that can't be recalled or reprinted cheaply.

This means:

- **DO NOT delete the `/hi` route.** It is in use in the real world.
- **DO NOT rename it** without adding a permanent **301 redirect** from
  `/hi` (preserving query strings) to wherever it moves. The redirect goes
  in [`vercel.json`](./vercel.json) under `redirects` — see
  [`vercel.json.md`](./vercel.json.md) for the exact placeholder structure
  and the rationale around query-string pass-through. Add it **before**
  the rename ships.
- **DO NOT change the `sku` parameter values.** The accepted values are
  exactly `onion`, `tomato`, `pepper`. These strings are encoded in
  printed QR codes. Changing them — including casing or spelling — breaks
  scanning behaviour for every bag already in the wild. If you need a new
  flavour, add a new SKU value; never repurpose an existing one.

### URLs encoded in printed QR codes

| Flavour | Printed URL |
|---------|-------------|
| Onion   | `https://eatcrosps.com/hi?sku=onion` |
| Tomato  | `https://eatcrosps.com/hi?sku=tomato` |
| Pepper  | `https://eatcrosps.com/hi?sku=pepper` |

The source SVGs for the printed codes live in `qr-codes/` so they can be
regenerated identically if needed. Any change to those URLs requires
reprinting packaging — treat it as a hard constraint.

### Recovering from a Klaviyo outage

The `/api/feedback` route writes every submission to Klaviyo. If Klaviyo
is down, returns 5xx, or the env vars are missing, the **full submission
payload is persisted to Vercel KV** under
`failed-submissions:<ISO>-<uuid>`. The user's flow always succeeds —
they never see an error. **Zero data loss is the design goal, not "best
effort".**

After Klaviyo recovers, replay the queued submissions from your laptop:

```bash
# Pull production env vars locally (Klaviyo + KV)
vercel env pull .env.local

npm run replay-failures -- --dry-run    # see what would be sent
npm run replay-failures                  # actually replay
```

Each entry that succeeds is removed from KV. Anything still failing stays
in the queue for the next run.

To inspect the queue without replaying (e.g. from a dashboard or curl):

```bash
curl -H "Authorization: Bearer $ADMIN_API_TOKEN" \
  https://eatcrosps.com/api/admin/failed-submissions
```

That endpoint requires `ADMIN_API_TOKEN` (set in Vercel env vars) — the
queue contains email addresses + free-text feedback, so it must never be
publicly readable. Tests in `tests/api/failed-submissions.test.ts` lock
in the auth gate.

#### Required env vars for the fallback path

| Var | Purpose | Where it comes from |
|-----|---------|---------------------|
| `KV_REST_API_URL` | Vercel KV endpoint | Auto-set when KV is connected to the Vercel project |
| `KV_REST_API_TOKEN` | Vercel KV write token | Auto-set when KV is connected to the Vercel project |
| `ADMIN_API_TOKEN` | Bearer token for `/api/admin/failed-submissions` | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` and set in Vercel + locally |

If KV itself is unavailable, the route logs the payload to the Vercel
function log (the original best-effort fallback) — but this is the last
line of defence. Operationally, KV should always be configured.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
