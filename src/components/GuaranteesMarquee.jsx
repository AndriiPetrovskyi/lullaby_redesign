import { CHECKOUT_ENABLED } from "../config/ordering.js";
import { BUSINESS_COUNTRY, RETURN_WINDOW_DAYS } from "../config/contact.js";
import "./GuaranteesMarquee.css";

// "Secure checkout" is only true once the site's own checkout is live; until
// then that slot promises the gift box instead.
const GUARANTEES = [
  "Free shipping on every order",
  `Handmade in ${BUSINESS_COUNTRY}`,
  "Message in a Vial in every box",
  CHECKOUT_ENABLED ? "Secure checkout" : "Ready to gift",
  `${RETURN_WINDOW_DAYS}-day returns`,
];

function MarqueeGroup({ hidden }) {
  return (
    <ul className="guarantees-marquee-group" aria-hidden={hidden || undefined}>
      {GUARANTEES.map((text) => (
        <li key={text} className="guarantees-marquee-item">
          {text}
          <span className="guarantees-marquee-dot" aria-hidden="true">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

// Full-width orange band of scrolling guarantees. The list renders twice so
// the loop has no gap; the copy is hidden from screen readers.
function GuaranteesMarquee({ className = "" }) {
  return (
    <div className={`guarantees-marquee ${className}`}>
      <div className="guarantees-marquee-track">
        <MarqueeGroup />
        <MarqueeGroup hidden />
      </div>
    </div>
  );
}

export default GuaranteesMarquee;
