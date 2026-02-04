# HazyProductions Digital Storefront

A cinematic, high-performance digital asset store built with Next.js 15, MongoDB, TailwindCSS v4, and Dodo Payments. Designed for creators, by creators.

## 🚀 Features

### Core E-commerce
- **Digital Products**: Sell Ebooks, SFX, Video Clips, and Templates.
- **Secure Delivery**: Signed S3/R2 URLs. Downloads are locked to verified purchasers.
- **Smart Cart**: Persistent shopping cart with real-time updates.
- **User Dashboard**: Order history, status tracking, and instant download center.

### User Engagement
- **Wishlist / Favorites**: Users can curate collections of their favorite assets.
- **Ratings & Reviews**: Verified purchase protection ensures only real buyers can leave 1-5 star reviews.
- **Interactive UI**:
    - **Cipher Text**: Hover effects that decode text dynamically.
    - **Magnetic Buttons**: Physics-based cursor attraction.
    - **Floating Relics**: Parallax background elements that drift in 3D space.
    - **Smoke Backgrounds**: Cinematic video layers.

### Administration
- **Admin Panel**: Secure dashboard for product management (Create, Edit, Delete).
- **Sales Analytics**: Visual overview of revenue and orders.
- **Asset Management**: Direct upload handling to Cloudflare R2 / AWS S3.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router / Turbopack)
- **Database**: MongoDB (Mongoose Schema)
- **Styling**: TailwindCSS v4 + Framer Motion
- **Payments**: Dodo Payments (w/ Webhook Fulfillment)
- **Storage**: Cloudflare R2 / AWS S3
- **Auth**: NextAuth.js (Google & Credentials)
- **Testing**: Jest (Unit) & Playwright (E2E)

## ⚡ Getting Started

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   Copy `.env.example` to `.env` and populate:
   - `MONGODB_URI`
   - `DODO_PAYMENTS_API_KEY` & `DODO_WEBHOOK_SECRET`
   - `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET_NAME`
   - `NEXTAUTH_SECRET` & `NEXTAUTH_URL`
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📦 Deployment

- **Vercel**: Recommended for Next.js.
- **Build Command**: `npm run build`
- **Output Directory**: `.next`

> **Note**: Ensure all environment variables are set in your deployment provider settings.

## 🧪 Testing

- **Unit Tests**: `npm test`
- **E2E Tests**: `npx playwright test`
