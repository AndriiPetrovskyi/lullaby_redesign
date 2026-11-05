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
  InitiateCheckout, so don't change its payload). `begin_checkout` also has
  `button` (`buy_now` or `paypal`, the button pressed) and `payment_type`
  (`card` or `paypal`, where it leads: "Buy now" goes to PayPal where cards
  aren't accepted); both need custom dimensions in GA4 to show in reports.
  "Order directly":
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
- An anonymous funnel (admin → CheckoutVisit, filterable by payment
  method): the card checkout page records opened, first keystroke, last
  field touched (names only); "Pay with PayPal" on the product page records
  a click (waiting at most 1.5 s for it). The backend adds the order and
  payment steps (`checkoutVisitId` on the order) and the method actually
  used, so "Prefer PayPal?" turns a card visit into a PayPal one.
- The checkout draft (product, email, quantity, method) is kept in
  sessionStorage `checkout-draft`, so the cancel page can link back: to the
  checkout after a card attempt, to the product page after PayPal.
- Prices show in USD; the payment page also shows the local currency, which is
  fine. Don't add currency hints.
- Reviews come from the backend (`GET /api/reviews`, added in the admin, real
  customer reviews only). Every candle shows all of them, its own first, and
  each card names its candle under the stars, so nobody takes a review of
  another candle for this one's. Above the candle's name: the stars, the average and "(N orders)",
  with N set by hand in `ORDERS_COUNT` (`src/config/contact.js`), only the
  real number. With no reviews, or if the request fails, both hide.

## Where things stand (update or delete as it changes)

As of Nov 4, 2026:
- Ads are live since Nov 2 (Meta, campaign `Candles_GiftGuide_Static_US_CA`,
  US and Canada, $12/day, optimizes for InitiateCheckout). Don't edit the
  campaign for now, so it doesn't relearn. First results: people press
  "Buy now" and stop on the email page, none from ads has paid yet.
- Merged and live: PayPal straight from the product page (the picked address
  arrives, order #1091); the card / PayPal split in GA4 and the admin.
  Andrii was to add the GA4 custom dimensions `button` and `payment_type`:
  not confirmed.
- Still unproven: that a real card payment returns the shipping address. A
  friend abroad is to test it. The $2 candle `test-paypal-2usd` is hidden
  (`is_active`; it has paid orders, so it isn't deleted): switch it on for the
  test, then off.
- Merged into local `main`, not pushed yet (Andrii said not to show reviews
  on the live site until he says so): reviews from the backend on every
  candle, with the block's design done with him. The live API already serves
  them. Backend branch `fix-local-run` (not merged, but it is what's deployed):
  see the backend's CLAUDE.md.
- Before reviews go live: the photos of Kristina V and Michael K were uploaded
  through a local admin, so they aren't on the volume. Upload them again in the
  live admin.
- On hold until Andrii looks at the orders on Fri Nov 6 or Sat Nov 7, 2026
  (in his Google Calendar, Nov 6 at 9:00), then he decides: three copy changes
  on the card checkout. They are only in a `git stash` on his Mac, on no
  branch, so here they are in full:
  1. Email field label: "Email for your receipt and tracking".
  2. Stepper: remove the "on Western Bid" note under "Shipping & payment", and
     its unused `.checkout-steps-note` style.
  3. Line above the button: "Secure Stripe payment by our partner Western Bid",
     which `SecureCheckoutLine` takes as children; the footer keeps its wording.
- Later, after the reviews: running the backend locally must never email
  buyers, with no flag to remember. Until then always
  `PAYMENT_REMINDERS=false`.
- Andrii's to do: refund order #1091 ($2), delete the unpaid test order #1090
  in the admin.
- Idea for later, once there are 6-8 reviews and the product page block is
  live: a small reviews block on the home page near the bottom, 3-4 in a row,
  picked by Andrii with a new "show on home page" switch in the admin. Product
  pages keep showing all reviews, critical ones too.
- Ideas, not scheduled: "what to give it with" gift pairing, one per candle,
  on the product page (the brown candle with whisky or brandy, Evening Garden
  with cherry-filled chocolates; the pairings come from him). Design changes
  he may do in Figma; the Figma MCP needs a paid Dev seat for real use. Next.js
  was only a question for the future.
