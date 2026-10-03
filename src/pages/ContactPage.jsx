import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import {
  BUSINESS_COUNTRY,
  CONTACT_EMAIL,
  DISPATCH_TIME,
  ETSY_SHOP_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
} from "../config/contact.js";
import "./SimplePage.css";

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with Lullaby — questions about orders, direct orders, shipping, or anything else."
        path="/contact"
      />
      <main className="simple-page">
        <h1 className="h1-heading">Contact Us</h1>
        <div className="simple-page-content">
          <p>
            Questions about a scent, an order, or a gift? We&apos;re a small
            handmade studio based in {BUSINESS_COUNTRY}, and every message is
            answered by the person who pours your candles. We usually reply
            within a few hours.
          </p>

          <ul className="contact-methods">
            <li>
              <span className="contact-method-label">Email</span>
              <a className="contact-method-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <span className="contact-method-label">Instagram</span>
              <a
                className="contact-method-link"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer">
                {INSTAGRAM_HANDLE}
              </a>
            </li>
            <li>
              <span className="contact-method-label">Etsy shop</span>
              <a
                className="contact-method-link"
                href={ETSY_SHOP_URL}
                target="_blank"
                rel="noreferrer">
                workshoplullaby.etsy.com
              </a>
            </li>
          </ul>

          <h2>Ordering directly</h2>
          <p>
            Prefer not to order through Etsy? Message us by email or on
            Instagram with the candle you&apos;d like and your shipping
            address. We&apos;ll confirm the details and send a secure payment
            request through PayPal or Payoneer. Once payment is received, your
            order ships within {DISPATCH_TIME}, with free shipping.
          </p>

          <h2>Orders, shipping &amp; returns</h2>
          <p>
            For an existing order, include your order number or the name the
            order was placed under so we can find it quickly. Shipping times,
            returns, and damaged items are covered in our{" "}
            <Link to="/terms">Terms &amp; Conditions</Link>.
          </p>
        </div>
      </main>
    </>
  );
}

export default ContactPage;
