import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { PayPalLogo, SecureCheckoutLine } from "../components/PaymentMethods.jsx";
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
import { openCheckoutVisit, updateCheckoutVisit } from "../services/checkoutVisits.js";
import { getTrafficSource } from "../utils/trafficSource.js";
import { trackEvent } from "../utils/metaPixel.js";
import { gaItem, trackGaEvent } from "../utils/googleAnalytics.js";
import { responsiveImage } from "../utils/images.js";
import "./SimplePage.css";
import "./CheckoutPage.css";

const money = (value) => `$${value.toFixed(2)}`;

// Long enough to read the hand-off message before the browser leaves.
const MIN_REDIRECT_NOTICE_MS = 900;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Leaving our site for the payment page is where buyers hesitate, so the
// checkout says up front that it's coming, and that the address is asked
// there.
function CheckoutSteps() {
  // The middle step names whose page it is, so the hand-off is expected.
  const steps = [
    { label: "Email" },
    { label: "Shipping & payment", note: "on Western Bid" },
    { label: "Confirmation" },
  ];
  return (
    <ol className="checkout-steps" aria-label="Checkout steps">
      {steps.map(({ label, note }, i) => (
        <li
          key={label}
          className={`checkout-steps-item${i === 0 ? " checkout-steps-item--current" : ""}`}
          aria-current={i === 0 ? "step" : undefined}>
          <span className="checkout-steps-dot" aria-hidden="true" />
          <span className="checkout-steps-label">{label}</span>
          {note && <span className="checkout-steps-note">{note}</span>}
        </li>
      ))}
    </ol>
  );
}

// Records this checkout visit in our own anonymous funnel (admin →
// CheckoutVisit): opened, then the first keystroke, then the last field
// touched. Field names only — never what was typed.
const FIELD_REPORT_DELAY_MS = 1500;

function useCheckoutVisit(productSlug) {
  const visitId = useRef(null);
  const hasStarted = useRef(false);
  const pending = useRef({});
  const timer = useRef(null);

  useEffect(() => {
    if (!productSlug) return undefined;
    let cancelled = false;
    // Deferred so React's dev-mode double mount doesn't open two visits.
    const start = setTimeout(() => {
      openCheckoutVisit({ productSlug, ...getTrafficSource() }).then((id) => {
        if (!cancelled) visitId.current = id;
      });
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [productSlug]);

  const flush = useCallback(() => {
    clearTimeout(timer.current);
    if (visitId.current && Object.keys(pending.current).length > 0) {
      updateCheckoutVisit(visitId.current, pending.current);
      pending.current = {};
    }
  }, []);

  useEffect(() => {
    const onHide = () => document.visibilityState === "hidden" && flush();
    document.addEventListener("visibilitychange", onHide);
    // Leaving for another URL (reload, typed address) doesn't always hide the
    // page first.
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
      flush();
    };
  }, [flush]);

  const noteField = useCallback(
    (field, extra = {}) => {
      Object.assign(pending.current, { lastField: field }, extra);
      if (!hasStarted.current) {
        hasStarted.current = true;
        pending.current.step = "STARTED";
        flush();
      } else {
        clearTimeout(timer.current);
        timer.current = setTimeout(flush, FIELD_REPORT_DELAY_MS);
      }
    },
    [flush],
  );

  return { visitId, noteField, flush };
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

// The card checkout: it asks us for the email only, since Western Bid passes
// it on to Stripe, whose page then asks for the shipping address and the
// card. PayPal needs nothing from us, so "Pay with PayPal" goes straight to
// PayPal, where the buyer picks the shipping address. Shipping is free
// everywhere, so the country isn't asked; the backend guesses it from the IP.
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
  const checkoutVisit = useCheckoutVisit(product?.slug);

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
  // Where card payments aren't allowed (Ukraine) the page offers PayPal only.
  const cardAvailable = config.paymentMethods.includes("card");

  const pay = async (method) => {
    setPayment({ method, error: null });
    checkoutVisit.flush();
    try {
      const [order] = await Promise.all([
        createOrder({
          productSlug: product.slug,
          quantity,
          paymentMethod: method,
          express: true,
          customer: {
            ...(method === "card" ? { email: email.trim() } : {}),
            country: config.shipToCountry,
          },
          ...orderTrackingFields(),
          checkoutVisitId: checkoutVisit.visitId.current ?? undefined,
        }),
        wait(MIN_REDIRECT_NOTICE_MS),
      ]);
      saveCheckoutDraft(product.slug, { email, quantity, method });
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
    pay(cardAvailable ? "card" : "paypal");
  };

  const payWithPayPal = () => {
    checkoutVisit.noteField("paymentMethod");
    pay("paypal");
  };

  const changeQuantity = (delta) => {
    checkoutVisit.noteField("quantity");
    setQuantity((q) => q + delta);
  };

  return (
    <>
      <Seo title="Checkout" path={`/checkout/${product.slug}`} noindex />
      <main className="checkout">
        <Link to={`/products/${product.slug}`} className="checkout-back">
          <span aria-hidden="true">←</span> Back to {product.name}
        </Link>
        <h1 className="checkout-title">Checkout</h1>
        {cardAvailable && <CheckoutSteps />}
        {payment && (
          <RedirectNotice
            paymentMethod={payment.method}
            error={payment.error}
            onClose={() => setPayment(null)}
          />
        )}

        <div className="checkout-layout">
          <div className="checkout-main">
            <form className="checkout-form" onSubmit={handleSubmit}>
              {cardAvailable ? (
                <>
                  <div className="checkout-field">
                    <label htmlFor="checkout-email">Email</label>
                    <input
                      id="checkout-email"
                      className="checkout-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      inputMode="email"
                      maxLength={200}
                      required
                      value={email}
                      onChange={(event) => {
                        checkoutVisit.noteField("email");
                        setEmail(event.target.value);
                      }}
                    />
                  </div>
                  <SecureCheckoutLine className="checkout-secure" />
                  <button
                    type="submit"
                    className="checkout-submit"
                    disabled={Boolean(payment) || isSoldOut}>
                    {isSoldOut ? "Sold out" : `Continue to payment · ${money(totals.total)}`}
                  </button>
                </>
              ) : (
                <>
                  <p className="checkout-region-note">
                    Card payments aren&apos;t available in your region — please pay
                    with PayPal.
                  </p>
                  <SecureCheckoutLine className="checkout-secure" />
                  <button
                    type="submit"
                    className="checkout-paypal-button"
                    disabled={Boolean(payment) || isSoldOut}
                    aria-label={isSoldOut ? "Sold out" : `Pay with PayPal, ${money(totals.total)}`}>
                    {isSoldOut ? (
                      "Sold out"
                    ) : (
                      <>
                        <span aria-hidden="true">Pay with</span> <PayPalLogo />
                        <span aria-hidden="true">· {money(totals.total)}</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </form>

            {!isSoldOut && cardAvailable && (
              <p className="checkout-switch">
                Prefer PayPal?{" "}
                <button
                  type="button"
                  className="checkout-switch-link"
                  disabled={Boolean(payment)}
                  onClick={payWithPayPal}>
                  Pay with PayPal
                </button>
              </p>
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
                    onClick={() => changeQuantity(-1)}>
                    −
                  </button>
                  <output aria-live="polite">{quantity}</output>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    disabled={quantity >= maxQuantity}
                    onClick={() => changeQuantity(1)}>
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
                <dt>Shipping</dt>
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
