import { Link } from "react-router-dom";
import { CHECKOUT_ENABLED } from "../config/ordering.js";
import { BUSINESS_COUNTRY, RETURN_WINDOW_DAYS } from "../config/contact.js";
import "./HomeClosing.css";

const ICONS = {
  shipping: (
    <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
  ),
  handmade: (
    <path d="M12 20s-7-4.35-7-10a4 4 0 0 1 7-2.65A4 4 0 0 1 19 10c0 5.65-7 10-7 10z" />
  ),
  gift: (
    <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13M12 7c-1.5-3-5-3-5-1s3 1 5 1zM12 7c1.5-3 5-3 5-1s-3 1-5 1z" />
  ),
  returns: <path d="M4 12a8 8 0 1 0 2.35-5.65M4 4v4h4" />,
  secure: <path d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" />,
};

// "Secure checkout" is only true once the site's own checkout is live; until
// then the slot promises the gift box instead.
const GUARANTEES = [
  { icon: "shipping", title: "Free shipping", text: "To the US, Canada & Europe" },
  { icon: "handmade", title: `Handmade in ${BUSINESS_COUNTRY}`, text: "Poured and finished by hand" },
  CHECKOUT_ENABLED
    ? { icon: "secure", title: "Secure checkout", text: "Card, Apple Pay, Google Pay or PayPal" }
    : { icon: "gift", title: "Ready to gift", text: "Arrives in a keepsake box" },
  { icon: "returns", title: `${RETURN_WINDOW_DAYS}-day returns`, text: "Easy, no-fuss returns" },
];

function HomeClosing() {
  return (
    <div className="home-closing">
      <ul className="home-guarantees">
        {GUARANTEES.map((item) => (
          <li key={item.icon} className="home-guarantee">
            <svg className="home-guarantee-icon" viewBox="0 0 24 24" aria-hidden="true">
              {ICONS[item.icon]}
            </svg>
            <p className="home-guarantee-title">{item.title}</p>
            <p className="home-guarantee-text">{item.text}</p>
          </li>
        ))}
      </ul>

      <div className="home-cta">
        <p className="home-cta-eyebrow">Light it. Gift it. Keep it.</p>
        <h2 className="home-cta-title">
          <span className="home-cta-title-script">Find your</span>
          <span className="home-cta-title-bold">scent</span>
        </h2>
        <Link to="/products" className="home-cta-button">
          Shop all scents
        </Link>
      </div>
    </div>
  );
}

export default HomeClosing;
