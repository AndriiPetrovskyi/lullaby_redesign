import "./PaymentMethods.css";

// Wallets are offered by the hosted Stripe page itself (on supported
// devices), so these are informational badges, not buttons.
export function CardBrandIcons() {
  return (
    <span
      className="payment-icons"
      role="img"
      aria-label="Visa, Mastercard, American Express, Apple Pay, Google Pay">
      <svg viewBox="0 0 38 24" aria-hidden="true">
        <rect width="38" height="24" rx="3" fill="#1434cb" />
        <text x="19" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="10" fill="#fff">VISA</text>
      </svg>
      <svg viewBox="0 0 38 24" aria-hidden="true">
        <rect width="38" height="24" rx="3" fill="#222" />
        <circle cx="15" cy="12" r="7" fill="#eb001b" />
        <circle cx="23" cy="12" r="7" fill="#f79e1b" fillOpacity="0.9" />
      </svg>
      <svg viewBox="0 0 38 24" aria-hidden="true">
        <rect width="38" height="24" rx="3" fill="#1f72cd" />
        <text x="19" y="15.5" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" fill="#fff">AMEX</text>
      </svg>
      <svg viewBox="0 0 38 24" aria-hidden="true">
        <rect x="0.5" y="0.5" width="37" height="23" rx="3" fill="#000" stroke="#000" />
        <path
          fill="#fff"
          transform="translate(6.6 6.2) scale(0.36)"
          d="M15.6 5.6c-.9 1.1-2.4 1.9-3.8 1.8-.2-1.5.5-3 1.3-4C14 2.3 15.6 1.5 16.8 1.4c.2 1.6-.4 3.1-1.2 4.2zm1.2 2c-2.1-.1-3.9 1.2-4.9 1.2s-2.5-1.1-4.2-1.1C5.5 7.8 3.4 9.1 2.3 11.2c-2.3 3.9-.6 9.7 1.6 12.9 1.1 1.6 2.4 3.3 4.1 3.2 1.6-.1 2.3-1.1 4.2-1.1 2 0 2.5 1.1 4.3 1 1.8 0 2.9-1.6 4-3.2 1.2-1.8 1.7-3.6 1.8-3.7 0 0-3.5-1.3-3.5-5.3 0-3.3 2.7-4.9 2.9-5-1.6-2.3-4-2.6-4.9-2.6z"
        />
        <text x="25" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="600" fontSize="9" fill="#fff">Pay</text>
      </svg>
      <svg viewBox="0 0 38 24" aria-hidden="true">
        <rect x="0.5" y="0.5" width="37" height="23" rx="3" fill="#fff" stroke="#c9c9c9" />
        <text x="7" y="16" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="10" fill="#4285f4">G</text>
        <text x="24" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="500" fontSize="9" fill="#3c4043">Pay</text>
      </svg>
    </span>
  );
}

export function PayPalLogo() {
  return (
    <svg className="paypal-logo" viewBox="0 0 74 20" role="img" aria-label="PayPal">
      <text x="0" y="15" fontFamily="Verdana, Arial, sans-serif" fontWeight="700" fontStyle="italic" fontSize="16" fill="#003087">
        Pay<tspan fill="#009cde">Pal</tspan>
      </text>
    </svg>
  );
}
