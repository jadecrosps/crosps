# vercel.json — packaging-anchor redirect notes

> ⚠️ **Read this before changing `/hi` or `vercel.json`.**

## Why this file exists

`vercel.json` is the documented home for the permanent 301 redirect that
will be needed **if and when** the `/hi` route is ever renamed.

The `/hi` route is the **physical packaging anchor URL** — printed QR codes
on Crosps snack-bag packaging point at it. Every bag already in retailers,
in customers' hands, or sitting in storage routes here. Bags can't be
recalled or reprinted cheaply, so `/hi` (and the SKU values it accepts)
are effectively immutable contracts with the physical world.

Today `vercel.json` has an empty `redirects` array — the canonical URL is
still `/hi`. The empty array is intentional: it gives a clearly-named hook
to add the redirect to without anyone having to figure out where it goes.

See **README.md → "⚠️ Critical: Physical packaging dependencies"** for the
full context, the do-not-touch rules, and the URLs encoded in printed QRs.

## If `/hi` is ever renamed

You **must** add a permanent 301 redirect from `/hi` to the new path
**before** the rename ships. Edit `vercel.json` to look like this
(currently this is the placeholder structure — uncomment / port across when
needed):

```jsonc
// vercel.json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "redirects": [
    {
      "source": "/hi",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}
```

`permanent: true` produces an HTTP **308** (the modern equivalent of 301 —
both signal a permanent move and both are honoured by browsers, search
engines, and QR-scanner apps). Use `permanent: true` and nothing else for
a packaging-anchor rename — short-term redirects (`permanent: false` →
HTTP 307) get aggressively re-cached by clients and break the link of
trust we have with already-printed bags.

### Query parameters pass through automatically ✅

Vercel preserves the request query string on `redirects` rules by default,
so the SKU param flows through unchanged:

| Scanned bag URL                          | Redirects to                                |
| ---------------------------------------- | ------------------------------------------- |
| `https://eatcrosps.com/hi?sku=onion`     | `https://eatcrosps.com/new-path?sku=onion`  |
| `https://eatcrosps.com/hi?sku=tomato`    | `https://eatcrosps.com/new-path?sku=tomato` |
| `https://eatcrosps.com/hi?sku=pepper`    | `https://eatcrosps.com/new-path?sku=pepper` |

This is the documented Vercel behaviour: query strings are appended to the
destination URL unless you explicitly match them with `has` and rewrite
them. **Do not** add `has: [{ "type": "query", "key": "sku" }]` to the
rule above — that would scope the redirect to URLs *with* a SKU and make
the bare `/hi` URL stop redirecting. The simple form is what we want.

This pass-through is critical: `sku` flows into Klaviyo as a profile/event
property (`onion` / `tomato` / `pepper`), and the funnel analysis depends
on it. A redirect that drops the param silently corrupts our data.

### Don't

- ❌ `permanent: false` — only `permanent: true` (HTTP 308) for a rename.
- ❌ Rewriting `sku` values during the redirect. Printed bags use the
  exact strings `onion`, `tomato`, `pepper`; the new route should accept
  them too.
- ❌ Removing `/hi` without adding the redirect at the same time. The
  redirect is the only thing protecting bags already in the wild.
- ❌ Adding the redirect without testing all three printed URLs end-to-end
  on a Vercel preview first.

### Verifying after a rename

After deploying the redirect, manually scan or `curl -I` each of:

```
curl -sI 'https://eatcrosps.com/hi?sku=onion'  | grep -iE '^(location|HTTP)'
curl -sI 'https://eatcrosps.com/hi?sku=tomato' | grep -iE '^(location|HTTP)'
curl -sI 'https://eatcrosps.com/hi?sku=pepper' | grep -iE '^(location|HTTP)'
```

Each should return a `308 Permanent Redirect` and a `Location:` header
that includes the SKU query parameter unchanged.
