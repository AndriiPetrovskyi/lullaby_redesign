import { NavLink } from "react-router-dom";
import navLinks from "../data/navLinks.js";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./icons/SocialIcons.jsx";
import "./Footer.css";

const legalLinks = [
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/privacy-policy", label: "Privacy Policy" },
];

const socialLinks = [
  { label: "Facebook", href: "#", Icon: FacebookIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "Instagram", href: "#", Icon: InstagramIcon },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <p className="footer-wordmark">Lullaby</p>
          <p className="footer-tagline">rituals</p>
        </div>

        <div className="footer-links">
          <nav className="footer-nav">
            <ul>
              {navLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.to === "/"}
                    className="footer-nav-link">
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="footer-legal">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className="footer-legal-link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <ul className="footer-socials">
          {socialLinks.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="footer-social-link">
                <Icon className="footer-social-icon" />
              </a>
            </li>
          ))}
        </ul>

        <p className="footer-copyright">
          © {new Date().getFullYear()} Lullaby. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
