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
