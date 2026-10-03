import Seo from "../components/Seo.jsx";
import {
  BUSINESS_COUNTRY,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
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

          <h2>1. Information we collect</h2>
          <ul>
            <li>
              <strong>Information you send us.</strong> When you contact us by
              email or Instagram (for example, to place a direct order), we
              receive what you share: your name, email address or Instagram
              username, shipping address, and the content of your messages.
            </li>
            <li>
              <strong>Payments.</strong> Direct orders are paid through PayPal
              or Payoneer, which process your payment under their own privacy
              policies. We never see or store your card details.
            </li>
            <li>
              <strong>Etsy orders.</strong> When you click &ldquo;Buy on
              Etsy&rdquo;, you leave our Site and your purchase is handled by
              Etsy under Etsy&apos;s privacy policy. Etsy shares with us the
              details needed to fulfil your order, such as your name and
              shipping address.
            </li>
            <li>
              <strong>Usage information.</strong> When you browse the Site, we
              and our analytics and advertising partners automatically collect
              information such as the pages you view, the buttons you click,
              your device and browser type, your approximate location (derived
              from your IP address), and how you arrived at the Site. Our
              hosting providers also keep standard server logs.
            </li>
          </ul>
          <p>
            The Site has no user accounts, contact forms, or checkout, so we
            don&apos;t collect payment details or passwords on it.
          </p>

          <h2>2. Cookies, analytics, and advertising</h2>
          <ul>
            <li>
              <strong>Google Analytics 4</strong> (Google LLC) helps us
              understand how visitors use the Site — which pages are visited
              and which products are viewed. It uses cookies. You can opt out
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
              and Instagram. When you view a product or click &ldquo;Buy on
              Etsy&rdquo; or &ldquo;Direct Order&rdquo;, information about that
              action — including your IP address, browser details, the page
              address, and the product — is sent to Meta, both from your
              browser and from our server. Meta may use cookies and combine
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
            Only with the services we need to run the business: Etsy, PayPal
            and Payoneer (payments), postal and courier services (to deliver
            your order), Google and Meta (analytics and advertising, as
            described above), and our hosting providers. We may also disclose
            information when required by law.
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
