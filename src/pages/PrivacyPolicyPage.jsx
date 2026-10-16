import Seo from "../components/Seo.jsx";
import {
  BUSINESS_COUNTRY,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  SELLER_ADDRESS,
  SELLER_EMAIL,
  SELLER_NAME,
  SELLER_STATUS,
} from "../config/contact.js";
import "./SimplePage.css";

function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Lullaby collects, uses, and protects your information — including analytics and advertising cookies."
        path="/privacy-policy"
      />
      <main className="simple-page">
        <h1 className="h1-heading">Privacy Policy</h1>
        <p className="simple-page-meta">Last updated: {LEGAL_LAST_UPDATED}</p>

        <div className="simple-page-content">
          <p>
            This policy explains how {BUSINESS_NAME} (&ldquo;Lullaby&rdquo;,
            &ldquo;we&rdquo;, &ldquo;us&rdquo;), a small handmade candle studio
            based in {BUSINESS_COUNTRY}, collects and uses information when you
            visit lullaby-rituals.com (the &ldquo;Site&rdquo;) or order from
            us.
          </p>
          <p>
            The data controller is {SELLER_NAME}, {SELLER_STATUS},{" "}
            {SELLER_ADDRESS.join(", ")} (
            <a href={`mailto:${SELLER_EMAIL}`}>{SELLER_EMAIL}</a>).
          </p>

          <h2>1. Information we collect</h2>
          <ul>
            <li>
              <strong>Orders on the Site.</strong> When you check out, we
              collect your name, email address, phone number, shipping
              address, the items you order, and your order total.
            </li>
            <li>
              <strong>Payments.</strong> Checkout payments are processed by our
              payment partner Western Bid, through Stripe (cards, Apple Pay,
              Google Pay) or PayPal, under their own privacy policies. Your
              card details are entered on their secure pages — we never see or
              store them. They send us back the payment status, a transaction
              ID, and, for PayPal, the shipping address you confirmed there.
              Direct orders are paid through PayPal or Payoneer.
            </li>
            <li>
              <strong>Information you send us.</strong> When you contact us by
              email or Instagram (for example, to place a direct order), we
              receive what you share: your name, email address or Instagram
              username, shipping address, and the content of your messages.
            </li>
            <li>
              <strong>Etsy orders.</strong> If you buy from our Etsy shop, your
              purchase is handled by Etsy under Etsy&apos;s privacy policy.
              Etsy shares with us the details needed to fulfil your order,
              such as your name and shipping address.
            </li>
            <li>
              <strong>Usage information.</strong> When you browse the Site, we
              and our analytics and advertising partners automatically collect
              information such as the pages you view, the buttons you click,
              your device and browser type, your approximate location (derived
              from your IP address), and how you arrived at the Site. Our
              hosting providers also keep standard server logs. At checkout we
              use your IP address to determine your country (with the
              GeoLite2 database by MaxMind) so we can offer the payment
              methods available there.
            </li>
          </ul>
          <p>
            The Site has no user accounts, so we don&apos;t ask you to create a
            password.
          </p>

          <h2>2. Cookies, analytics, and advertising</h2>
          <ul>
            <li>
              <strong>Google Analytics 4</strong> (Google LLC) helps us
              understand how visitors use the Site — which pages are visited
              and which products are viewed. It uses cookies. When an order is
              paid, our server reports the purchase (order number, product,
              and amount — not your name or contact details) to Google
              Analytics, linked to your browsing session. You can opt out
              with Google&apos;s{" "}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                target="_blank"
                rel="noreferrer">
                Analytics opt-out browser add-on
              </a>
              .
            </li>
            <li>
              <strong>Meta Pixel and Meta Conversions API</strong> (Meta
              Platforms, Inc.) help us measure and improve our ads on Facebook
              and Instagram. When you view a product, start checkout, or
              click &ldquo;Direct Order&rdquo;, information about that action
              — including your IP address, browser details, the page address,
              and the product — is sent to Meta, both from your browser and
              from our server. When you complete a purchase, our server also
              sends Meta the order value and your email, phone number, name,
              city, postal code, and country in hashed (scrambled) form, so
              Meta can match the purchase to an ad you saw without receiving
              those details in readable form. Meta may use cookies and combine
              this with other information it holds about you. You can manage
              how Meta uses your information for ads in your Facebook or
              Instagram ad preferences.
            </li>
          </ul>
          <p>
            You can block or delete cookies in your browser settings. The Site
            will keep working, though our analytics will be less accurate.
          </p>

          <h2>3. How we use information</h2>
          <ul>
            <li>To process, ship, and support your orders, including returns.</li>
            <li>To reply to your messages.</li>
            <li>To understand how the Site is used and improve it.</li>
            <li>To measure and improve our advertising.</li>
            <li>To meet our legal, tax, and accounting obligations.</li>
          </ul>
          <p>We do not sell your personal information.</p>

          <h2>4. Who we share it with</h2>
          <p>
            Only with the services we need to run the business: Western Bid,
            Stripe, PayPal, and Payoneer (payments), Etsy (for Etsy orders),
            postal and courier services (your name, address, and phone number,
            to deliver your order and contact you about delivery), Google and
            Meta (analytics and advertising, as described above), and our
            hosting and database providers. We may also disclose information
            when required by law.
          </p>

          <h2>5. International transfers</h2>
          <p>
            We are based in {BUSINESS_COUNTRY}, and some of the services we use
            (including Google and Meta) process data in the United States and
            other countries. These providers apply their own safeguards to
            protect it.
          </p>

          <h2>6. How long we keep it</h2>
          <p>
            We keep order and message information for as long as needed to
            complete and support your order and to meet accounting and legal
            requirements. Analytics and advertising data is kept according to
            the retention settings of Google and Meta.
          </p>

          <h2>7. Your rights</h2>
          <p>
            Depending on where you live (for example, under the GDPR in the
            EU/UK or California privacy law), you may have the right to access,
            correct, or delete your personal information, to object to or
            restrict how we use it, and to withdraw consent. To make a request,
            email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. You can
            also complain to your local data protection authority.
          </p>

          <h2>8. Children</h2>
          <p>
            The Site is not intended for children under 16, and we do not
            knowingly collect their information.
          </p>

          <h2>9. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of
            this page shows the latest version.
          </p>

          <h2>10. Contact</h2>
          <p>
            Questions about your privacy? Email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </main>
    </>
  );
}

export default PrivacyPolicyPage;
