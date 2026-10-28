// Single source for public contact details, shipping and returns terms —
// used by the Direct Order modal, footers, and the Contact/Terms/Privacy
// pages so they can never drift apart.
export const BUSINESS_NAME = "Lullaby Rituals";
export const BUSINESS_COUNTRY = "Ukraine";

// Seller identity, required for online sales to EU consumers.
export const SELLER_NAME = "Andrii Petrovskyi";
export const SELLER_STATUS = "individual entrepreneur (FOP), registered in Ukraine";
export const SELLER_ADDRESS = [
  "20 Henerala Tarnavskoho St, apt. 11",
  "Bibrka, Lviv Oblast, 81220",
  "Ukraine",
];
export const SELLER_EMAIL = "andriipetrovskyi.it@gmail.com";

export const CONTACT_EMAIL = "lullaby.rituals@gmail.com";
export const CONTACT_EMAIL_HANDLE = "lullaby.rituals";
export const INSTAGRAM_HANDLE = "@lullaby.rituals";
export const INSTAGRAM_URL = "https://www.instagram.com/lullaby.rituals";
export const ETSY_SHOP_URL = "https://workshoplullaby.etsy.com";

export const RETURN_WINDOW_DAYS = 14;
export const DAMAGE_REPORT_HOURS = 48;
export const DISPATCH_TIME = "2–3 business days";
export const DELIVERY_TIME = "8–14 business days";

// Marketing copy only — the checkout's real fees come from the backend
// (src/utils/shippingRegions.js there). Keep the two in step.
export const FREE_SHIPPING_REGIONS = "the US, Canada and Europe";
export const PAID_SHIPPING_NOTE =
  "Australia, New Zealand, Israel, Japan, South Korea, Singapore and the UAE: flat $15 delivery fee";

export const LEGAL_LAST_UPDATED = "October 24, 2026";

// Merchant of Record disclaimer required by Western Bid (and through them by
// Stripe and PayPal). Keep the wording verbatim and on at least two pages.
export const MOR_DISCLAIMER =
  "This store is integrated with the Western Bid™ e-commerce platform, and Western Bid, Inc. is the Merchant of Record for all purchases made in this store. Therefore, you will see “WESTERN BID” listed as the payee on your PayPal account and credit card statement.";
