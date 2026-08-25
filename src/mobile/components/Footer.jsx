import { NavLink } from "react-router-dom";
import navLinks from "../../data/navLinks.js";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
} from "../../components/icons/SocialIcons.jsx";
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
    <footer className="m-footer">
      <div className="m-footer-brand">
        <p className="m-footer-wordmark">Lullaby</p>
        <span className="m-footer-tagline">rituals</span>
      </div>

      <div className="m-footer-links">
        <nav className="m-footer-nav">
          <ul>
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className="m-footer-nav-link">
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <ul className="m-footer-legal">
          {legalLinks.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className="m-footer-legal-link">
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <ul className="m-footer-socials">
        {socialLinks.map(({ label, href, Icon }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="m-footer-social-link">
              <Icon className="m-footer-social-icon" />
            </a>
          </li>
        ))}
      </ul>

      <p className="m-footer-copyright">
        © {new Date().getFullYear()} Lullaby. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
