import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { PayPalLogo, SecureCheckoutBox } from "../components/PaymentMethods.jsx";
import RedirectNotice from "../components/RedirectNotice.jsx";
import Seo from "../components/Seo.jsx";
import { useProduct } from "../hooks/useProducts.js";
import { CHECKOUT_ENABLED, ORDERING_PAUSED } from "../config/ordering.js";
import { CONTACT_EMAIL, DELIVERY_TIME } from "../config/contact.js";
import {
  createOrder,
  getCheckoutConfig,
  orderTrackingFields,
  readCheckoutDraft,
  redirectToPayment,
  saveCheckoutDraft,
} from "../services/orders.js";
import { trackEvent } from "../utils/metaPixel.js";
import { gaItem, trackGaEvent } from "../utils/googleAnalytics.js";
import { responsiveImage } from "../utils/images.js";
import "./SimplePage.css";
import "./CheckoutPage.css";

const money = (value) => `$${value.toFixed(2)}`;

// Long enough to read the hand-off message before the browser leaves.
const MIN_REDIRECT_NOTICE_MS = 900;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Leaving our site for a page with another company's name on it is where
// buyers hesitate, so the checkout says up front that it's coming.
function CheckoutSteps() {
  return (
    <ol className="checkout-steps" aria-label="Checkout steps">
      <li className="checkout-steps-item checkout-steps-item--current" aria-current="step">
        <span className="checkout-steps-number">1</span> Email
      </li>
      <li className="checkout-steps-item">
        <span className="checkout-steps-number">2</span> Shipping &amp; payment
      </li>
      <li className="checkout-steps-item">
        <span className="checkout-steps-number">3</span> Confirmation
      </li>
    </ol>
  );
}

function CheckoutUnavailable({ title, children }) {
  return (
    <>
      <Seo title="Checkout" path="/checkout" noindex />
      <main className="simple-page">
        <h1 className="h1-heading">{title}</h1>
        <div className="simple-page-content">{children}</div>
      </main>
    </>
  );
}

// Card checkout asks us for the email only: Western Bid passes it on to
// Stripe, whose page then asks for the shipping address and the card. PayPal
// needs nothing from us at all.
function CheckoutPage() {
  const { slug } = useParams();
  const { product, isLoading, error } = useProduct(slug);
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState(false);
  // Back from the payment page: the email and quantity are still there.
  const [draft] = useState(() => readCheckoutDraft(slug));
  const [email, setEmail] = useState(draft?.email ?? "");
  const [quantity, setQuantity] = useState(draft?.quantity ?? 1);
  // Going to the payment page: null, or { method, error }.
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    getCheckoutConfig()
      .then(setConfig)
      .catch(() => setConfigError(true));
  }, []);

  // Back from the payment page via the browser's back button restores this
  // page from the back-forward cache, still showing "Taking you to…".
  useEffect(() => {
    const onPageShow = (event) => event.persisted && setPayment(null);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  // A restored draft may ask for more than is left in stock now.
  useEffect(() => {
    if (product) setQuantity((q) => Math.max(1, Math.min(q, product.stock)));
  }, [product]);

  const shipTo = config?.countries.find((c) => c.code === config.shipToCountry);
  const shippingCents = shipTo?.shippingCents ?? 0;

  // Mirrors the backend's math, which is what actually gets charged.
  const totals = useMemo(() => {
    const price = Number(product?.price ?? 0);
    const subtotal = price * quantity;
    const shipping = shippingCents / 100;
    return { price, subtotal, shipping, total: subtotal + shipping };
  }, [product, quantity, shippingCents]);

  if (!CHECKOUT_ENABLED || ORDERING_PAUSED) {
    return (
      <CheckoutUnavailable title="Checkout">
        <p>
          Online checkout isn&apos;t open yet. Please check back soon or write
          to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </CheckoutUnavailable>
    );
  }

  if (isLoading || (!config && !configError)) {
    return (
      <main>
        <LoadingScreen />
      </main>
    );
  }

  if (error || !product) {
    return (
      <CheckoutUnavailable title="Candle not found">
        <p>
          This candle isn&apos;t available. <Link to="/products">See all scents</Link>.
        </p>
      </CheckoutUnavailable>
    );
  }

  if (configError || !config.enabled) {
    return (
      <CheckoutUnavailable title="Checkout">
        <p>
          Online checkout is temporarily unavailable. Please try again later or
          write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </CheckoutUnavailable>
    );
  }

  const maxQuantity = Math.min(config.maxQuantity, product.stock);
  const isSoldOut = product.stock < 1;
  const cardAvailable = config.paymentMethods.includes("card");

  const pay = async (method) => {
    setPayment({ method, error: null });
    try {
      const [order] = await Promise.all([
        createOrder({
          productSlug: product.slug,
          quantity,
          paymentMethod: method,
          express: true,
          ...(method === "card" ? { customer: { email: email.trim() } } : {}),
          ...orderTrackingFields(),
        }),
        wait(MIN_REDIRECT_NOTICE_MS),
      ]);
      saveCheckoutDraft(product.slug, { email, quantity });
      trackEvent("AddPaymentInfo", {
        content_ids: [product.id],
        content_name: product.name,
        value: totals.total,
        currency: "USD",
      });
      trackGaEvent("add_payment_info", {
        ...gaItem(product),
        value: totals.total,
        payment_type: method,
        items: [{ ...gaItem(product).items[0], quantity }],
      });
      redirectToPayment(order);
    } catch (err) {
      setPayment({ method, error: err.message });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    pay("card");
  };

  return (
    <>
      <Seo title="Checkout" path={`/checkout/${product.slug}`} noindex />
      <main className="checkout">
        <Link to={`/products/${product.slug}`} className="checkout-back">
          <span aria-hidden="true">←</span> Back to {product.name}
        </Link>
        <h1 className="checkout-title">Checkout</h1>
        <CheckoutSteps />
        {payment && (
          <RedirectNotice
            paymentMethod={payment.method}
            error={payment.error}
            onClose={() => setPayment(null)}
          />
        )}

        <div className="checkout-layout">
          <div className="checkout-main">
            {cardAvailable ? (
              <form className="checkout-form" onSubmit={handleSubmit}>
                <div className="checkout-field">
                  <label htmlFor="checkout-email">Email</label>
                  <input
                    id="checkout-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    inputMode="email"
                    maxLength={200}
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <p className="checkout-field-note">
                    For your order confirmation and delivery updates.
                  </p>
                </div>

                <button
                  type="submit"
                  className="checkout-submit"
                  disabled={Boolean(payment) || isSoldOut}>
                  {isSoldOut
                    ? "Sold out"
                    : `Continue to secure payment · ${money(totals.total)}`}
                </button>
                <SecureCheckoutBox />
              </form>
            ) : (
              <p className="checkout-region-note">
                Card payments aren&apos;t available in your region — please pay
                with PayPal.
              </p>
            )}

            <section className="checkout-next" aria-labelledby="checkout-next-title">
              <h2 id="checkout-next-title" className="checkout-next-title">
                What happens next
              </h2>
              <ol className="checkout-next-list">
                <li>
                  On the secure payment page, enter your shipping address and pay
                  by card, Apple Pay or Google Pay. We never see your card details.
                </li>
                <li>
                  The payment page is run by our partner <strong>Western Bid</strong>{" "}
                  through Stripe. It&apos;s the name you&apos;ll see there and on
                  your statement.
                </li>
                <li>
                  We email your order confirmation, then ship your candle.
                  Delivery takes {DELIVERY_TIME}.
                </li>
              </ol>
            </section>

            {!isSoldOut && (
              <div className="checkout-paypal">
                <p className="checkout-paypal-label">Prefer PayPal?</p>
                <button
                  type="button"
                  className="checkout-paypal-button"
                  disabled={Boolean(payment)}
                  onClick={() => pay("paypal")}
                  aria-label="Pay with PayPal">
                  <span aria-hidden="true">Pay with</span> <PayPalLogo />
                </button>
              </div>
            )}
          </div>

          <aside className="checkout-summary" aria-label="Order summary">
            <div className="checkout-item">
              <img
                className="checkout-item-image"
                {...responsiveImage(product.image, [200, 400], "96px")}
                alt={product.name}
              />
              <div>
                <p className="checkout-item-name">{product.name}</p>
                <p className="checkout-item-price">{money(totals.price)}</p>
              </div>
            </div>

            {!isSoldOut && (
              <div className="checkout-quantity">
                <span id="checkout-quantity-label">Quantity</span>
                <div className="checkout-stepper" role="group" aria-labelledby="checkout-quantity-label">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity((q) => q - 1)}>
                    −
                  </button>
                  <output aria-live="polite">{quantity}</output>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= maxQuantity}
                    onClick={() => setQuantity((q) => q + 1)}>
                    +
                  </button>
                </div>
              </div>
            )}

            <dl className="checkout-totals">
              <div>
                <dt>Subtotal</dt>
                <dd>{money(totals.subtotal)}</dd>
              </div>
              <div>
                <dt>Shipping{shipTo ? ` to ${shipTo.name}` : ""}</dt>
                <dd>{totals.shipping > 0 ? money(totals.shipping) : "Free"}</dd>
              </div>
              <div className="checkout-totals-total">
                <dt>Total</dt>
                <dd>{money(totals.total)} USD</dd>
              </div>
            </dl>
            <p className="checkout-delivery">Delivery in {DELIVERY_TIME}.</p>
          </aside>
        </div>
      </main>
    </>
  );
}

export default CheckoutPage;
