import { Link } from "react-router-dom";
import { CHECKOUT_ENABLED } from "../config/ordering.js";
import { BUSINESS_COUNTRY, RETURN_WINDOW_DAYS } from "../config/contact.js";
import "./HomeClosing.css";

// "Secure checkout" is only true once the site's own checkout is live; until
// then that slot promises the gift box instead.
const GUARANTEES = [
  "Free shipping to the US, Canada & Europe",
  `Handmade in ${BUSINESS_COUNTRY}`,
  "Message in a Vial in every box",
  CHECKOUT_ENABLED ? "Secure checkout" : "Ready to gift",
  `${RETURN_WINDOW_DAYS}-day returns`,
];

function MarqueeGroup({ hidden }) {
  return (
    <ul className="home-marquee-group" aria-hidden={hidden || undefined}>
      {GUARANTEES.map((text) => (
        <li key={text} className="home-marquee-item">
          {text}
          <span className="home-marquee-dot" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

function HomeClosing() {
  return (
    <div className="home-closing">
      {/* The list is rendered twice so the strip can loop with no gap; the
          copy is hidden from screen readers. */}
      <div className="home-marquee">
        <div className="home-marquee-track">
          <MarqueeGroup />
          <MarqueeGroup hidden />
        </div>
      </div>

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
