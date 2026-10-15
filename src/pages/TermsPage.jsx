import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import {
  BUSINESS_COUNTRY,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  DAMAGE_REPORT_HOURS,
  DELIVERY_TIME,
  DISPATCH_TIME,
  FREE_SHIPPING_REGIONS,
  LEGAL_LAST_UPDATED,
  PAID_SHIPPING_NOTE,
  RETURN_WINDOW_DAYS,
} from "../config/contact.js";
import "./SimplePage.css";

function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Lullaby's terms and conditions — ordering, payment, shipping, returns, and candle care."
        path="/terms"
      />
      <main className="simple-page">
        <h1 className="h1-heading">Terms &amp; Conditions</h1>
        <p className="simple-page-meta">Last updated: {LEGAL_LAST_UPDATED}</p>

        <div className="simple-page-content">
          <p>
            These terms apply to your use of lullaby-rituals.com (the
            &ldquo;Site&rdquo;) and to purchases of {BUSINESS_NAME} candles
            (&ldquo;Lullaby&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). We are a
            small handmade candle studio based in {BUSINESS_COUNTRY}. By using
            the Site or placing an order, you agree to these terms.
          </p>

          <h2>1. Our products</h2>
          <p>
            Every candle and vessel is made by hand. Small variations in
            color, shape, texture, and finish are part of that process and are
            not defects. Product photos are representative; colors can look
            slightly different depending on your screen.
          </p>
          <p>
            Each candle includes a small corked vial with a handwritten note as
            a little gift. Notes are written by hand for fun and vary from
            candle to candle.
          </p>

          <h2>2. How to order</h2>
          <ul>
            <li>
              <strong>On the Site.</strong> The &ldquo;Buy now&rdquo; button
              opens our checkout, where you enter your shipping details and pay
              by card (including Apple Pay and Google Pay, where available) or
              PayPal. Payments are processed securely by our payment partner,
              Western Bid, through Stripe or PayPal — we never see or store your
              card details. The charge on your statement may show
              &ldquo;Western Bid&rdquo; or &ldquo;WB&rdquo;. Your order is
              confirmed once payment is received.
            </li>
            <li>
              <strong>Direct order.</strong> Contact us by email or Instagram
              (see <Link to="/contact">Contact</Link>). We confirm the details
              and send a payment request via PayPal or Payoneer. Your order is
              confirmed once payment is received.
            </li>
            <li>
              <strong>Through Etsy.</strong> Some of our candles are also
              available in our Etsy shop. Purchases made there are subject to
              Etsy&apos;s terms, policies, and purchase protection.
            </li>
          </ul>
          <p>
            Card payments aren&apos;t available in every region; where they
            aren&apos;t, the checkout offers PayPal instead. We may cancel and
            fully refund an order if an item turns out to be out of stock or
            the order can&apos;t be shipped to the address given.
          </p>

          <h2>3. Prices</h2>
          <p>
            Prices are shown in US dollars. We may change prices at any time;
            the price at the moment you pay is the price that applies to your
            order. The checkout shows the full total — item, delivery, and
            any sales tax (for example, Florida sales tax on some US card
            payments) — before you pay.
          </p>

          <h2>4. Shipping</h2>
          <ul>
            <li>
              Shipping is free to {FREE_SHIPPING_REGIONS}. A few farther
              destinations have a delivery fee ({PAID_SHIPPING_NOTE}), shown
              at checkout before you pay.
            </li>
            <li>
              We can only ship to the countries listed at checkout.
            </li>
            <li>Orders ship within {DISPATCH_TIME}.</li>
            <li>
              Delivery typically takes {DELIVERY_TIME}, depending on your
              location. Delivery times are estimates; delays caused by postal
              services or customs are outside our control.
            </li>
            <li>
              Orders ship from {BUSINESS_COUNTRY}. Any import duties or taxes
              charged by your country are the buyer&apos;s responsibility.
            </li>
          </ul>

          <h2>5. Returns &amp; refunds</h2>
          <ul>
            <li>
              You can return an item within {RETURN_WINDOW_DAYS} days of
              delivery. Please contact us first so we can confirm the return.
            </li>
            <li>
              Returned items must be unused and in their original packaging.
              For hygiene and safety reasons, candles that have been burned
              can&apos;t be returned.
            </li>
            <li>
              Return shipping is paid by the buyer, unless the item arrived
              damaged or was not what you ordered.
            </li>
            <li>
              Refunds are issued to the original payment method (card or
              PayPal) once we receive and check the returned item. Your bank
              or PayPal may take a few days to show it.
            </li>
            <li>
              For orders placed on Etsy, please start a return through Etsy
              messages so it follows Etsy&apos;s process.
            </li>
          </ul>

          <h2>6. Damaged or incorrect items</h2>
          <p>
            If your order arrives damaged or isn&apos;t what you ordered,
            contact us within {DAMAGE_REPORT_HOURS} hours of delivery with
            photos of the item and packaging. We&apos;ll send a replacement or
            issue a refund at no cost to you.
          </p>

          <h2>7. Candle safety</h2>
          <ul>
            <li>Never leave a burning candle unattended.</li>
            <li>
              Keep candles away from children, pets, drafts, and anything
              flammable.
            </li>
            <li>Burn on a stable, heat-resistant surface.</li>
            <li>
              Trim the wick to about 5 mm before each use, and don&apos;t burn
              for more than 4 hours at a time.
            </li>
            <li>Stop using the candle when about 1 cm of wax remains.</li>
          </ul>
          <p>
            We aren&apos;t responsible for damage or injury caused by using a
            candle in a way that ignores these instructions.
          </p>

          <h2>8. Site content</h2>
          <p>
            All photos, videos, text, and designs on the Site belong to{" "}
            {BUSINESS_NAME} and may not be copied or reused without our
            permission.
          </p>

          <h2>9. Limitation of liability</h2>
          <p>
            To the extent permitted by law, our total liability for any claim
            related to an order is limited to the amount you paid for that
            order, and we are not liable for indirect or consequential losses.
            Nothing in these terms limits rights you have under the consumer
            protection laws of your country.
          </p>

          <h2>10. Governing law</h2>
          <p>
            These terms are governed by the laws of {BUSINESS_COUNTRY}, without
            affecting any mandatory consumer protection rules of the country
            where you live.
          </p>

          <h2>11. Changes</h2>
          <p>
            We may update these terms from time to time. The date at the top
            of this page shows the latest version.
          </p>

          <h2>12. Contact</h2>
          <p>
            Questions about these terms? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </main>
    </>
  );
}

export default TermsPage;
