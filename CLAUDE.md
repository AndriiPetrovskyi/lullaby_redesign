# Lullaby Rituals — storefront

Frontend of lullaby-rituals.com (scented candles shop). Owner: Andrii. Talk to
him in Ukrainian, short and to the point.

The project is two repos:
- `lullaby_redesign` (this one): Vite + React, hosted on Vercel.
- `lullaby_backend`: Express + Prisma + AdminJS on Railway, Neon Postgres. Its
  CLAUDE.md describes payments (Western Bid), orders and deploying the API.

Andrii works on it from more than one computer. This file is the shared memory:
update it in the same change whenever something below stops being true.

## Rules from Andrii

- Never merge into `main` or deploy without his explicit go-ahead. Work on a
  branch, test, show him, then merge when he says so.
- After every change, verify every detail yourself, on desktop and on a phone
  width: that it works and that nothing else broke (no horizontal scroll, no
  console errors).
- Change only what he asked for. Don't touch `.env` files or the production
  database unless he asks.
- Don't propose asking Western Bid anything; work with what their gateway does.
- He checks designs on his phone, so mobile layout matters first.

## Deploy

- Vercel deploys `main` automatically on push. Branches get preview URLs.
- `npm run build` also generates the sitemap and prerendered meta;
  `npm run lint` runs oxlint.
- Public config is in `.env.production` (API URL, Meta Pixel, GA4, site URL).
  `VITE_CHECKOUT_ENABLED` and `VITE_ORDERING_PAUSED` switch buying on and off
  (`src/config/ordering.js`).

## Buying flow

- Product page "Buy now":
  - card: goes to `/checkout/:slug`, which asks only for the email (the
    country is a changeable line); Stripe asks for the address;
  - PayPal button, or card unavailable in the buyer's region (e.g. Ukraine):
    goes to `/checkout/:slug?pay=paypal` (no email, no phone). PayPal only
    ships to the address saved on the buyer's PayPal account (Western Bid
    turns its address step off), so the page asks "Where should we send it?":
    "My home address" (default, the one saved in PayPal, nothing to fill in,
    express order) or "A different address" (full name, address, apartment,
    city, ZIP, state for US/CA; sent as a regular non-express order).
- Checkout page (`src/pages/CheckoutPage.jsx`), card: deliberately minimal
  (Andrii's ask): the email field (required), a "Shipping to <country> ·
  Change" line (country guessed from IP; Change opens the "Ship to" select,
  which sets the shipping price), "Continue to secure payment · $X", one
  "Secure payment by Western Bid" line and a small "Prefer PayPal? Pay with
  PayPal" link. No stepper, no "What happens next".
- PayPal checkout: dot stepper (Shipping, Payment "on PayPal",
  Confirmation), the address choice, country, the PayPal button, the Western
  Bid trust box, "What happens next" and "Prefer to pay by card?".
- Both have the order summary with a quantity stepper. On mobile the CSS
  reorders blocks with `display: contents`; the mobile media block must stay at
  the end of the CSS file.
- `SecureCheckoutBox` (`src/components/PaymentMethods.jsx`): "Secure checkout
  by Western Bid", shown under the buy buttons and on checkout.
- The checkout draft (product, email, quantity, country, PayPal address
  choice, method) is kept in
  sessionStorage `checkout-draft`, so the cancel page can link back to it.
- Prices show in USD; the payment page also shows the local currency, which is
  fine. Don't add currency hints.
- Reviews: `REVIEWS` in `src/data/reviews.js` is empty in production, so the
  rating is hidden there.
