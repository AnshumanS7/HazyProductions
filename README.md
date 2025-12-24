# HazyProductions Digital Storefront

A cinematic, high-performance digital asset store built with Next.js 14, MongoDB, TailwindCSS, and Stripe.

## Features

- **Cinematic UI/UX**: Dark mode, glassmorphism, and smooth animations.
- **Digital Products**: Sell Ebooks, SFX, Video Clips, and Templates.
- **Secure Delivery**: S3/R2 signed URLs for purchased assets.
- **Payments**: Integrated Stripe Checkout with webhook fulfillment.
- **Admin Panel**: Manage products and view sales stats.
- **Authentication**: NextAuth with Google & Credentials.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: MongoDB (Mongoose)
- **Styling**: TailwindCSS v4
- **Storage**: AWS S3 / Cloudflare R2
- **Testing**: Jest (Unit), Playwright (E2E)

## Getting Started

1. **Clone the repo**
2. **Install dependencies**: `npm install`
3. **Environment Setup**: Copy `env.example` to `.env` and fill in credentials.
   - MongoDB connection string
   - Stripe keys
   - AWS/R2 keys
   - NextAuth Secret
4. **Run Development Server**: `npm run dev`

## Deployment

- **Vercel**: Connect repo, set environment variables.
- **MongoDB**: Whitelist Vercel IPs or allow all (0.0.0.0/0).
- **Stripe**: Add endpoint to Webhooks pointing to `https://your-domain.com/api/webhook/stripe`.

## Testing

- Unit: `npm test`
- E2E: `npx playwright test`
