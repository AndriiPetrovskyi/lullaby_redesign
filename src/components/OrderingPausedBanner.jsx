import { ORDERING_PAUSED } from "../config/ordering.js";
import "./OrderingPausedBanner.css";

function OrderingPausedBanner() {
  if (!ORDERING_PAUSED) return null;

  return (
    <div className="ordering-paused-banner" role="status">
      <p className="ordering-paused-banner-text">
        We&apos;ve temporarily paused new orders while we update our collection.
        Orders will reopen soon.
      </p>
    </div>
  );
}

export default OrderingPausedBanner;
