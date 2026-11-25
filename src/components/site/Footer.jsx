// The site footer: four columns (brand, shop, help, contact) and a bottom
// line with the copyright and the legal pages.

import Link from "next/link";
import {
  CONTACT_EMAIL,
  DELIVERY_TIME,
  INSTAGRAM_URL,
  RETURN_WINDOW_DAYS,
} from "../../config/contact.js";
import { SecureCheckoutLine } from "../PaymentMethods.jsx";
import CookieSettingsButton from "./CookieSettingsButton.jsx";
import styles from "./Footer.module.css";

// The same pages as in the header menu
const shopLinks = [
  { href: "/products", label: "All scents" },
  { href: "/about", label: "Our workshop" },
  { href: "/contact", label: "Contact us" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.columns}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Lullaby<span className={styles.logoAccent}>Rituals</span>
            </Link>
            <p className={styles.text}>
              Handmade candles in gypsum vessels, ready to give as a gift
            </p>
          </div>

          <div>
            <h3 className={styles.heading}>Shop</h3>
            <ul className={styles.list}>
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={styles.heading}>Help</h3>
            <ul className={styles.list}>
              <li>
                <Link href="/terms">Shipping &amp; returns</Link>
              </li>
              <li>Free shipping · {DELIVERY_TIME}</li>
              <li>{RETURN_WINDOW_DAYS}-day returns</li>
              <li>
                <CookieSettingsButton className={styles.textButton} />
              </li>
            </ul>
          </div>

          <div className={styles.contact}>
            <h3 className={styles.heading}>Contact</h3>
            <ul className={styles.list}>
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <SecureCheckoutLine className={styles.secure} />

        <div className={styles.bottom}>
          <p>© {year} Lullaby Rituals</p>
          <p className={styles.legal}>
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </p>
          <p>Handmade in Ukraine</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
