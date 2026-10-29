import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { CardBrandIcons, PayPalLogo } from "../components/PaymentMethods.jsx";
import Seo from "../components/Seo.jsx";
import Select from "../components/ui/Select.jsx";
import { useProduct } from "../hooks/useProducts.js";
import { CHECKOUT_ENABLED, ORDERING_PAUSED } from "../config/ordering.js";
import { CONTACT_EMAIL, DELIVERY_TIME, MOR_DISCLAIMER } from "../config/contact.js";
import {
  createOrder,
  getCheckoutConfig,
  readCheckoutDraft,
  redirectToPayment,
  saveCheckoutDraft,
} from "../services/orders.js";
import { openCheckoutVisit, updateCheckoutVisit } from "../services/checkoutVisits.js";
import { hasTrackingConsent } from "../utils/consent.js";
import { getTrafficSource } from "../utils/trafficSource.js";
import { trackEvent } from "../utils/metaPixel.js";
import { gaItem, getGaIds, trackGaEvent } from "../utils/googleAnalytics.js";
import { responsiveImage } from "../utils/images.js";
import "./SimplePage.css";
import "./CheckoutPage.css";

const EMPTY_FORM = {
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  country: "US",
  state: "",
  city: "",
  address1: "",
  address2: "",
  zip: "",
};

const readCookie = (name) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

const money = (value) => `$${value.toFixed(2)}`;

// Long enough to read the hand-off message before the browser leaves.
const MIN_REDIRECT_NOTICE_MS = 900;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Leaving our site for a page with another company's name on it is where
// buyers hesitate, so the checkout says up front that it's coming.
function CheckoutSteps({ isPayPal }) {
  return (
    <ol className="checkout-steps" aria-label="Checkout steps">
      <li className="checkout-steps-item checkout-steps-item--current" aria-current="step">
        <span className="checkout-steps-number">1</span> Your details
      </li>
      <li className="checkout-steps-item">
        <span className="checkout-steps-number">2</span>{" "}
        {isPayPal ? "Pay on PayPal" : "Secure payment"}
      </li>
      <li className="checkout-steps-item">
        <span className="checkout-steps-number">3</span> Confirmation
      </li>
    </ol>
  );
}

// A sketch of the Stripe page the card option leads to, so it looks
// familiar when it opens: the partner's name, the currency to pick, wallets.
function CardPaymentPreview({ total }) {
  return (
    <div className="checkout-preview">
      <p className="checkout-preview-caption">Next, our secure payment page:</p>
      <div className="checkout-preview-page" aria-hidden="true">
        <p className="checkout-preview-merchant">Western Bid Inc</p>
        <p className="checkout-preview-label">Choose currency</p>
        <div className="checkout-preview-currencies">
          <span className="checkout-preview-currency checkout-preview-currency--picked">
            🇺🇸 {money(total)}
          </span>
          <span className="checkout-preview-currency">Other currency</span>
        </div>
        <p className="checkout-preview-methods">Card · Apple Pay · Google Pay</p>
        <p className="checkout-preview-footer">Powered by stripe</p>
      </div>
      <ul className="checkout-preview-notes">
        <li>
          <strong>Western Bid</strong> is our payment partner. You&apos;ll see
          their name there and on your statement.
        </li>
        <li>
          Pick <strong>USD ($)</strong> so you pay exactly {money(total)}.
        </li>
      </ul>
    </div>
  );
}

function RedirectNotice({ paymentMethod }) {
  const isPayPal = paymentMethod === "paypal";
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
            : "Payment page by our partner Western Bid, powered by Stripe. Remember to pick USD ($)."}
        </p>
      </div>
    </div>
  );
}

function Field({ label, name, form, onChange, optional, className, ...props }) {
  const id = `checkout-${name}`;
  return (
    <div className={`checkout-field ${className ?? ""}`}>
      <label htmlFor={id}>
        {label}
        {optional && <span className="checkout-optional"> (optional)</span>}
      </label>
      <input
        id={id}
        name={name}
        value={form[name]}
        onChange={onChange}
        required={!optional}
        {...props}
      />
    </div>
  );
}

// One row of the Shopify-style payment list: a radio, the method's logos,
// and an explanation that unfolds while it is selected.
function PaymentOption({ value, selected, onSelect, label, badge, children }) {
  const isSelected = selected === value;
  const id = `checkout-payment-${value}`;
  return (
    <div
      className={`checkout-payment-option${isSelected ? " checkout-payment-option--selected" : ""}`}>
      <label className="checkout-payment-head" htmlFor={id}>
        <input
          id={id}
          type="radio"
          name="paymentMethod"
          value={value}
          checked={isSelected}
          onChange={() => onSelect(value)}
        />
        <span className="checkout-payment-label">{label}</span>
        <span className="checkout-payment-badge" aria-hidden="true">
          {badge}
        </span>
      </label>
      {isSelected && <p className="checkout-payment-body">{children}</p>}
    </div>
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
    return () => {
      document.removeEventListener("visibilitychange", onHide);
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

function CheckoutPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { product, isLoading, error } = useProduct(slug);
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState(false);
  // Back from the payment page (or a retry link): pick up where they left.
  const [draft] = useState(() => readCheckoutDraft(slug));
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, ...draft?.form }));
  const [quantity, setQuantity] = useState(draft?.quantity ?? 1);
  const [paymentMethod, setPaymentMethod] = useState(
    searchParams.get("method") ?? draft?.paymentMethod ?? "card",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const checkoutVisit = useCheckoutVisit(product?.slug);

  useEffect(() => {
    getCheckoutConfig()
      .then((data) => {
        setConfig(data);
        // Card payments are off in some regions — fall back to what's offered.
        setPaymentMethod((current) =>
          data.paymentMethods.includes(current) ? current : data.paymentMethods[0],
        );
      })
      .catch(() => setConfigError(true));
  }, []);

  // A restored draft may ask for more than is left in stock now.
  useEffect(() => {
    if (product) setQuantity((q) => Math.max(1, Math.min(q, product.stock)));
  }, [product]);

  // Came from the product page's PayPal button: a PayPal-only form, with a
  // way back to card if they change their mind.
  const isPayPalFlow =
    searchParams.get("method") === "paypal" &&
    paymentMethod === "paypal" &&
    Boolean(config?.paymentMethods.includes("paypal"));

  const switchToCard = () => {
    checkoutVisit.noteField("paymentMethod");
    setPaymentMethod("card");
    setSearchParams({}, { replace: true });
  };

  const country = config?.countries.find((c) => c.code === form.country);
  const taxRate =
    config?.taxRates.find(
      (rate) =>
        rate.paymentMethod === paymentMethod &&
        rate.country === form.country &&
        rate.region === form.state,
    )?.rate ?? 0;

  const shippingCents = country?.shippingCents ?? 0;

  // Mirrors the backend's math, which is what actually gets charged.
  const totals = useMemo(() => {
    const price = Number(product?.price ?? 0);
    const subtotal = price * quantity;
    const shipping = shippingCents / 100;
    const tax = Math.round((subtotal + shipping) * taxRate * 100) / 100;
    return { price, subtotal, shipping, tax, total: subtotal + shipping + tax };
  }, [product, quantity, shippingCents, taxRate]);

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

  const handleChange = (event) => {
    const { name, value } = event.target;
    checkoutVisit.noteField(name, name === "country" ? { shipToCountry: value } : {});
    setForm((prev) =>
      name === "country" ? { ...prev, country: value, state: "" } : { ...prev, [name]: value },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    checkoutVisit.flush();
    try {
      const [order] = await Promise.all([
        createOrder({
          productSlug: product.slug,
          quantity,
          paymentMethod,
          customer: form,
          fbp: readCookie("_fbp"),
          fbc: readCookie("_fbc"),
          ...getGaIds(),
          trackingConsent: hasTrackingConsent(),
          checkoutVisitId: checkoutVisit.visitId.current ?? undefined,
        }),
        wait(MIN_REDIRECT_NOTICE_MS),
      ]);
      saveCheckoutDraft(product.slug, { form, quantity, paymentMethod });
      trackEvent("AddPaymentInfo", {
        content_ids: [product.id],
        content_name: product.name,
        value: totals.total,
        currency: "USD",
      });
      trackGaEvent("add_payment_info", {
        ...gaItem(product),
        value: totals.total,
        payment_type: paymentMethod,
        items: [{ ...gaItem(product).items[0], quantity }],
      });
      redirectToPayment(order);
    } catch (err) {
      setSubmitError(err.message);
      setIsSubmitting(false);
    }
  };

  const selectPaymentMethod = (method) => {
    checkoutVisit.noteField("paymentMethod");
    setPaymentMethod(method);
  };

  const changeQuantity = (delta) => {
    checkoutVisit.noteField("quantity");
    setQuantity((q) => q + delta);
  };

  const fieldProps = { form, onChange: handleChange };

  return (
    <>
      <Seo title="Checkout" path={`/checkout/${product.slug}`} noindex />
      <main className="checkout">
        <Link to={`/products/${product.slug}`} className="checkout-back">
          <span aria-hidden="true">←</span> Back to {product.name}
        </Link>
        <h1 className="checkout-title">
          {isPayPalFlow ? "Checkout with PayPal" : "Checkout"}
        </h1>
        <CheckoutSteps isPayPal={isPayPalFlow} />
        {isSubmitting && <RedirectNotice paymentMethod={paymentMethod} />}

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <fieldset className="checkout-section">
              <legend>Contact</legend>
              <div className="checkout-grid">
                <Field label="Email" name="email" type="email" autoComplete="email" maxLength={200} {...fieldProps} />
                <Field label="Phone" name="phone" type="tel" autoComplete="tel" maxLength={30} {...fieldProps} />
              </div>
            </fieldset>

            <fieldset className="checkout-section">
              <legend>Shipping address</legend>
              <div className="checkout-grid">
                <Field label="First name" name="firstName" autoComplete="given-name" maxLength={100} {...fieldProps} />
                <Field label="Last name" name="lastName" autoComplete="family-name" maxLength={100} {...fieldProps} />

                <div className="checkout-field checkout-field--wide">
                  <label htmlFor="checkout-country">Country</label>
                  <Select
                    id="checkout-country"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    autoComplete="country"
                    required
                    options={config.countries.map((c) => ({ value: c.code, label: c.name }))}
                  />
                </div>

                <Field label="Address" name="address1" autoComplete="address-line1" maxLength={200} className="checkout-field--wide" {...fieldProps} />
                <Field label="Apartment, suite, etc." name="address2" autoComplete="address-line2" maxLength={200} optional className="checkout-field--wide" {...fieldProps} />
                <Field label="City" name="city" autoComplete="address-level2" maxLength={100} {...fieldProps} />

                {country?.regions && (
                  <div className="checkout-field">
                    <label htmlFor="checkout-state">
                      {form.country === "CA" ? "Province" : "State"}
                    </label>
                    <Select
                      id="checkout-state"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      autoComplete="address-level1"
                      required
                      options={country.regions.map((r) => ({ value: r.code, label: r.name }))}
                    />
                  </div>
                )}

                <Field
                  label={form.country === "US" ? "ZIP code" : "Postal code"}
                  name="zip"
                  autoComplete="postal-code"
                  maxLength={20}
                  {...fieldProps}
                />
              </div>
            </fieldset>

            {isPayPalFlow ? (
              <fieldset className="checkout-section">
                <legend>Payment</legend>
                <div className="checkout-paypal-flow">
                  <PayPalLogo />
                  <p>
                    Next you&apos;ll log in to PayPal and confirm the payment.
                    We&apos;ll ship to the address above, and PayPal will show
                    it too.
                  </p>
                </div>
                <div className="checkout-mor-note">
                  <p>
                    <strong>Disclaimer.</strong> We&apos;re a small handmade studio
                    based in Ukraine. {MOR_DISCLAIMER}
                  </p>
                </div>
                {config.paymentMethods.includes("card") && (
                  <p className="checkout-switch-method">
                    <button type="button" onClick={switchToCard}>
                      Pay by card, Apple Pay or Google Pay instead
                    </button>
                  </p>
                )}
              </fieldset>
            ) : (
              <fieldset className="checkout-section">
                <legend>Payment</legend>
                <p className="checkout-section-note">
                  All transactions are secure and encrypted.
                </p>
                {config.cardUnavailableInRegion && (
                  <p className="checkout-region-note">
                    Card payments aren&apos;t available in your region — please pay
                    with PayPal.
                  </p>
                )}
                <div className="checkout-payment">
                  {config.paymentMethods.includes("card") && (
                    <PaymentOption
                      value="card"
                      selected={paymentMethod}
                      onSelect={selectPaymentMethod}
                      label="Card, Apple Pay or Google Pay"
                      badge={<CardBrandIcons />}>
                      You&apos;ll pay on a secure Stripe page by card, Apple Pay or
                      Google Pay. We never see or store your card details.
                    </PaymentOption>
                  )}
                  {config.paymentMethods.includes("paypal") && (
                    <PaymentOption
                      value="paypal"
                      selected={paymentMethod}
                      onSelect={selectPaymentMethod}
                      label="PayPal"
                      badge={<PayPalLogo />}>
                      After clicking &ldquo;Pay with PayPal&rdquo;, you&apos;ll be
                      redirected to PayPal to complete your purchase securely.
                    </PaymentOption>
                  )}
                </div>
                <div className="checkout-mor-note">
                  <p>
                    <strong>Disclaimer.</strong> We&apos;re a small handmade studio
                    based in Ukraine. {MOR_DISCLAIMER}
                  </p>
                </div>
                {paymentMethod === "card" && <CardPaymentPreview total={totals.total} />}
              </fieldset>
            )}

            {submitError && (
              <p className="checkout-error" role="alert">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              className="checkout-submit"
              disabled={isSubmitting || isSoldOut}>
              {isSoldOut
                ? "Sold out"
                : isSubmitting
                  ? "Redirecting to payment…"
                  : paymentMethod === "paypal"
                    ? `Continue to PayPal · ${money(totals.total)}`
                    : `Continue to secure payment · ${money(totals.total)}`}
            </button>
            {!isSoldOut && (
              <p className="checkout-secure-note">
                <span aria-hidden="true">🔒</span>{" "}
                {paymentMethod === "paypal"
                  ? "You'll finish your payment securely on PayPal."
                  : "Secure payment powered by Stripe. We never see your card details."}
              </p>
            )}
          </form>

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
              {totals.tax > 0 && (
                <div>
                  <dt>Sales tax (Florida)</dt>
                  <dd>{money(totals.tax)}</dd>
                </div>
              )}
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
