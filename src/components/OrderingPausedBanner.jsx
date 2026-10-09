import { ORDERING_PAUSED } from "../config/ordering.js";
import "./OrderingPausedBanner.css";

function OrderingPausedBanner() {
  if (!ORDERING_PAUSED) return null;

  return (
    <div className="ordering-paused-banner" role="status">
      <p className="ordering-paused-banner-text">
        We&apos;ve temporarily paused new orders. International shipping
        regulations restrict seeds in packaging — we&apos;re updating our
        candles to meet these requirements. Orders will resume shortly.
      </p>
    </div>
  );
}

export default OrderingPausedBanner;
