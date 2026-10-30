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
- One branch per working session: create it at the start and put every task
  of that session in it, until it is merged or he asks for a new branch.
  Don't make a branch per task. Keep it checked out in his local folder.
- After every change, verify every detail yourself, on desktop and on a phone
  width: that it works and that nothing else broke (no horizontal scroll, no
  console errors).
- Change only what he asked for. Don't touch `.env` files or the production
  database unless he asks.
- Don't propose asking Western Bid anything; work with what their gateway does.
- He checks designs on his phone, so mobile layout matters first.

## Deploy

- Vercel deploys `main` automatically on push. Branches get preview URLs.
  It is the only host (the old GitHub Pages and Netlify setups are gone).
- `npm run build` also generates the sitemap and prerendered meta;
  `npm run lint` runs oxlint.
- Public config is in `.env.production` (API URL, Meta Pixel, GA4, site URL).
  `VITE_CHECKOUT_ENABLED` and `VITE_ORDERING_PAUSED` (set in the Vercel
  dashboard, not in that file) switch buying on and off
  (`src/config/ordering.js`).

## Buying flow

- Product page "Buy now":
  - card: goes to `/checkout/:slug`, which asks only for the email; Stripe
    asks for the address. Shipping is free everywhere, so no country is
    asked; the backend guesses it from the IP.
  - PayPal button, or card unavailable in the buyer's region (e.g. Ukraine,
    which is why Andrii goes to PayPal from both buttons): no checkout page,
    the order (quantity 1) is created right there and the buyer goes
    straight to PayPal, which lets them pick or add the shipping address
    (only because we don't send `no_shipping=2`, which locked it to the
    account's address).
- Checkout page (`src/pages/CheckoutPage.jsx`), card: deliberately minimal
  (Andrii's ask): a dot stepper (Email, Shipping & payment "on Western Bid",
  Confirmation; it tells buyers the address is asked on the next page), the
  email field (required), a "🔒 Secure payment by Western Bid" line right
  above the button "Continue to payment · $X", and a small "Prefer PayPal?
  Pay with PayPal" link that goes straight to PayPal with the chosen
  quantity. No "What happens next". Where card is unavailable the page shows
  a region note and a PayPal button instead of the email.
- The order summary has a quantity stepper. On mobile the CSS
  reorders blocks with `display: contents`; the mobile media block must stay at
  the end of the CSS file.
- `SecureCheckoutBox` (`src/components/PaymentMethods.jsx`): "Secure checkout
  by Western Bid", shown under the buy buttons.
  `SecureCheckoutLine` (same file): one "Secure payment by Western Bid" line
  in the footer of every page (desktop and mobile footers) and above the card
  checkout button.
- The checkout page records an anonymous funnel (admin → CheckoutVisit):
  opened, first keystroke, last field touched (names only), then the order
  and payment steps from the backend (`checkoutVisitId` on the order).
- The checkout draft (product, email, quantity, method) is kept in
  sessionStorage `checkout-draft`, so the cancel page can link back: to the
  checkout after a card attempt, to the product page after PayPal.
- Prices show in USD; the payment page also shows the local currency, which is
  fine. Don't add currency hints.
- Reviews: `REVIEWS` in `src/data/reviews.js` is empty in production, so the
  rating is hidden there.
