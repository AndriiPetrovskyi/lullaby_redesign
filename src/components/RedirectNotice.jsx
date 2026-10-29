import "./RedirectNotice.css";

// Full-screen "taking you to payment" notice while the order is created,
// so leaving for a page with Western Bid's name on it isn't a surprise.
// With an error it turns into a message the buyer can close.
function RedirectNotice({ paymentMethod, error, onClose }) {
  const isPayPal = paymentMethod === "paypal";
  if (error) {
    return (
      <div className="checkout-redirect" role="alert">
        <div className="checkout-redirect-box">
          <p className="checkout-redirect-title">Couldn&apos;t start the payment</p>
          <p className="checkout-redirect-text">{error}</p>
          <button type="button" className="checkout-redirect-close" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="checkout-redirect" role="status" aria-live="assertive">
      <div className="checkout-redirect-box">
        <span className="checkout-redirect-spinner" aria-hidden="true" />
        <p className="checkout-redirect-title">
          {isPayPal ? "Taking you to PayPal…" : "Taking you to secure payment…"}
        </p>
        <p className="checkout-redirect-text">
          {isPayPal
            ? "Our payment partner Western Bid will show as the payee."
            : "Payment page by our partner Western Bid, powered by Stripe."}
        </p>
      </div>
    </div>
  );
}

export default RedirectNotice;
