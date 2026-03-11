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
