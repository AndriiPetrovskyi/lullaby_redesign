import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { CardBrandIcons, PayPalLogo } from "../components/PaymentMethods.jsx";
import Seo from "../components/Seo.jsx";
import Select from "../components/ui/Select.jsx";
import { useProduct } from "../hooks/useProducts.js";
import { CHECKOUT_ENABLED, ORDERING_PAUSED } from "../config/ordering.js";
import { CONTACT_EMAIL, DELIVERY_TIME } from "../config/contact.js";
import {
  createOrder,
  getCheckoutConfig,
  redirectToPayment,
} from "../services/orders.js";
import { hasTrackingConsent } from "../utils/consent.js";
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
  const { product, isLoading, error } = useProduct(slug);
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    setForm((prev) =>
      name === "country" ? { ...prev, country: value, state: "" } : { ...prev, [name]: value },
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);
    try {
      const order = await createOrder({
        productSlug: product.slug,
        quantity,
        paymentMethod,
        customer: form,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
        ...getGaIds(),
        trackingConsent: hasTrackingConsent(),
      });
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

  const fieldProps = { form, onChange: handleChange };

  return (
    <>
      <Seo title="Checkout" path={`/checkout/${product.slug}`} noindex />
      <main className="checkout">
        <Link to={`/products/${product.slug}`} className="checkout-back">
          <span aria-hidden="true">←</span> Back to {product.name}
        </Link>
        <h1 className="checkout-title">Checkout</h1>

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
                    onSelect={setPaymentMethod}
                    label="Card, Apple Pay or Google Pay"
                    badge={<CardBrandIcons />}>
                    After clicking &ldquo;Continue to payment&rdquo;, you&apos;ll be
                    redirected to a secure Stripe page to pay by card, Apple Pay or
                    Google Pay. We never see or store your card details.
                  </PaymentOption>
                )}
                {config.paymentMethods.includes("paypal") && (
                  <PaymentOption
                    value="paypal"
                    selected={paymentMethod}
                    onSelect={setPaymentMethod}
                    label="PayPal"
                    badge={<PayPalLogo />}>
                    After clicking &ldquo;Pay with PayPal&rdquo;, you&apos;ll be
                    redirected to PayPal to complete your purchase securely.
                  </PaymentOption>
                )}
              </div>
            </fieldset>

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
                    ? `Pay with PayPal · ${money(totals.total)}`
                    : `Continue to payment · ${money(totals.total)}`}
            </button>
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
