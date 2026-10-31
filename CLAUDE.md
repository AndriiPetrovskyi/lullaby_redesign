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

## Running it locally

- Andrii's own setup: the backend with `PAYMENT_REMINDERS=false railway run
  node src/server.js` on port 3000 (production database and the real
  Western Bid), and Vite for his phone on the same Wi-Fi. That Vite needs a
  config that proxies `/api` to the backend, so the backend sees a loopback
  request (`isLocalRequest`: every payment method offered, no rate limits).
  Keep it outside the repo, e.g. in the scratchpad:
  ```js
  import base from '<repo>/vite.config.js'
  export default (env) => ({ ...base(env), root: '<repo>',
    server: { proxy: { '/api': 'http://localhost:3000' } } })
  ```
  `VITE_API_BASE_URL=/api VITE_ORDERING_PAUSED=false VITE_CHECKOUT_ENABLED=true
  npx vite --config <that file> --host --port 5173`, then give him
  `http://<Mac's IP>:5173` (`ipconfig getifaddr en0`; it changes with the
  Wi-Fi). Orders placed this way are real: production database, real
  payment pages.
- Your own tests must not write to the production database: run a second
  backend on port 3001 against a throwaway Postgres (see the backend's
  CLAUDE.md) and Vite on 5174 with `VITE_API_BASE_URL=http://localhost:3001/api`.
  Drive it with headless Chrome over CDP, and block requests to
  `*westernbid*` so nothing reaches the real gateway.

## Analytics

Meta Pixel and GA4 run only on the deployed site, after cookie consent where
it's required (`src/utils/consent.js`).
- Product page: `ViewContent` / `view_item`; any buy button:
  `InitiateCheckout` / `begin_checkout` (the Meta ad campaign optimizes for
  InitiateCheckout, so don't change its payload); "Order directly":
  `Contact` / `generate_lead`.
- Leaving for the payment page: `AddPaymentInfo` / `add_payment_info` with
  `payment_type` card or paypal. For PayPal it fires on the product page,
  right after begin_checkout, since there is no checkout page in between.
- Purchase: the browser pixel on the thank-you page plus Meta CAPI from the
  backend (same event id); GA4 `purchase` only from the backend.

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

## Where things stand (update or delete as it changes)

As of Oct 31, 2026:
- Merged into `main` (both repos): "Pay with PayPal" goes straight to
  PayPal from the product page, the PayPal checkout page and its address
  form are gone, the backend stops sending `no_shipping=2`. Proven with a
  real payment (order #1091): the address picked on PayPal arrives in the
  IPN and lands on the order.
- Next, in a new branch: split analytics and the admin by payment method
  (card "Buy now" vs PayPal): a payment method on `begin_checkout`,
  without breaking InitiateCheckout for the ads; record PayPal clicks in
  CheckoutVisit too; show and filter orders by `paymentGate` in the admin.
- After that, in its own branch: some design changes Andrii will describe.
- The ordered list is also in his Google Calendar on Oct 31, 2026
  ("Lullaby: PayPal одразу на PayPal — тест і запуск").
- Idea from Andrii (not scheduled yet): tell buyers what to give each candle
  with, as a gift pairing. His examples: the brown candle with a bottle of
  whisky or brandy; Evening Garden with chocolates with a cherry filling.
  One pairing per candle, probably on the product page; the pairings
  themselves come from him.
