# E-Commerce Platform

A full-stack e-commerce application composed of a Node.js/Express backend and a React (Vite) frontend. It supports user authentication with Clerk, payments via Stripe, product image storage on Cloudflare R2, and is intended to be deployed with Render (backend) and Vercel/Netlify (frontend).

## Features

### Authentication & Authorization
- Clerk-based sign-up/sign-in
- Protected routes & admin role checks

### Product Catalog
- Categories, colors, search, and sorting
- Product details with images and reviews

### Shopping Experience
- Redux-managed cart
- Checkout flow: cart → address → payment → completion
- Stripe Embedded Checkout with webhook fulfillment

### Reviews & Ratings
- Create, update, and delete reviews (per user)

### Order Management
- **Customers**: view personal orders
- **Admins**: view all orders & daily sales statistics

### Admin Tools
- Create products with image uploads to Cloudflare R2
- Dashboard and sales analytics

## Tech Stack

- **Backend**: Express, Mongoose, Stripe, Clerk
- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, RTK Query
- **Storage**: MongoDB, Cloudflare R2

## Project Structure

```
e-commerce-platform/
├── fed-2-back-end/   # Express/Mongoose API
└── fed-2-front-end/  # React/Vite client
```

## Environment Variables

### Backend (`fed-2-back-end/.env`)

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
MONGODB_URL=your_mongodb_connection_string
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...   # optional for server-side checks
CLOUDFLARE_ACCOUNT_ID=...
CLOUDFLARE_ACCESS_KEY_ID=...
CLOUDFLARE_SECRET_ACCESS_KEY=...
CLOUDFLARE_BUCKET_NAME=product-images
CLOUDFLARE_PUBLIC_DOMAIN=https://<your-r2-public-domain>
NODE_ENV=development
```

### Frontend (`fed-2-front-end/.env`)

```env
VITE_BASE_URL=http://localhost:8000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## External Services & Configuration

### MongoDB
1. Create a MongoDB Atlas cluster (or other MongoDB instance)
2. Obtain the connection URI and set `MONGODB_URL`

### Cloudflare R2 (Object Storage)
1. Create an R2 bucket for product images
2. Generate an access key pair and note the account ID
3. Configure a public domain to serve objects
4. Provide the credentials via `CLOUDFLARE_*` variables

### Clerk (Authentication)
1. Create a Clerk application
2. Add allowed callback/origin URLs (localhost, Vercel domain)
3. Copy the Publishable key for `VITE_CLERK_PUBLISHABLE_KEY`
4. Copy the Secret key for `CLERK_SECRET_KEY`

### Stripe (Payments)
1. Create a Stripe account
2. Retrieve the Publishable key (`VITE_STRIPE_PUBLISHABLE_KEY`) and Secret key (`STRIPE_SECRET_KEY`)
3. Set up a webhook endpoint pointing to `/api/stripe/webhook` and store the `STRIPE_WEBHOOK_SECRET`

## Deployment

### Render (Backend Hosting)
1. Create a new Web Service targeting `fed-2-back-end`
2. Set environment variables from the backend `.env`
3. **Build command**: `npm install && npm run build` (if needed)
4. **Start command**: `npm start`

### Vercel (Frontend Hosting)
1. Create a new Vercel project targeting `fed-2-front-end`
2. Add the frontend `.env` variables in Vercel settings
3. **Build command**: `npm run build`

## Running Locally

### Backend
```bash
cd fed-2-back-end
npm install
npm run dev
```

### Frontend
```bash
cd fed-2-front-end
npm install
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) for the frontend (ensure the backend runs on [http://localhost:8000](http://localhost:8000)).

## Database Seeding

Populate MongoDB (and Stripe products) with demo data:

```bash
cd fed-2-back-end
npm run seed
```

> **Note**: Ensure MongoDB and Stripe keys are configured before running the seed script.

## Deployment Notes

- **Render**: After deploying the backend, update the frontend's `VITE_BASE_URL` to the Render service URL
- **Vercel/Netlify**: Re-deploy whenever environment variables or the backend URL changes

## Acknowledgements

- [Clerk](https://clerk.dev/) – user management
- [Stripe](https://stripe.com/) – payment processing
- [Cloudflare R2](https://developers.cloudflare.com/r2) – object storage
- [Render](https://render.com/) & [Vercel](https://vercel.com/) & [Netlify](https://netlify.com/) – deployment platforms
