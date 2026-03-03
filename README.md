# PEVALIT Web (Next.js + Tailwind)

Modernized marketing and product website for PEVALIT built with Next.js App Router, Tailwind CSS, and typed local content.

## Stack

- Next.js 15
- React 19
- Tailwind CSS 4
- TypeScript
- Zod validation
- Resend email API
- hCaptcha verification

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Content structure

English content is in:

- `src/content/en/site.json`
- `src/content/en/categories.json`
- `src/content/en/products.json`
- `src/content/en/catalogs.json`
- `src/content/en/corporate.json`

Schema validation is in `src/lib/types.ts` and loaded in `src/lib/content.ts`.

## Form backend

`POST /api/contact` validates payload with zod, checks honeypot/time trap, verifies hCaptcha, and sends email via Resend.

Required env vars:

- `RESEND_API_KEY`
- `HCAPTCHA_SECRET`
- `NEXT_PUBLIC_HCAPTCHA_SITE_KEY`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`
- `CONTACT_AUTOREPLY_ENABLED` (optional, `true`/`false`)

## Asset sync script

Scrape images and PDFs from the live site and apply them to local content:

```bash
npm run sync:assets:dry
npm run sync:assets
```

What it does:

- Crawls `https://pevalit.com` (override with `ASSET_SOURCE_URL`)
- Downloads images to `public/images/imported`
- Downloads PDFs to `public/catalogs/imported`
- Strictly updates product images in `src/content/en/products.json` (`imageUrl`) only when product name/slug strongly matches old-site assets.
- Leaves unmatched products unchanged.
- Creates backup file in `scripts/backups/` before writing.
- Writes mapping/download report to `scripts/sync-assets-report.json`

Optional environment variables:

- `ASSET_SOURCE_URL` (default: `https://pevalit.com`)
- `MAX_PAGES` (default: `120`)
