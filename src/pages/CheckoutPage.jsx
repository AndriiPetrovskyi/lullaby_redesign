import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen.jsx";
import { PayPalLogo, SecureCheckoutBox, SecureCheckoutLine } from "../components/PaymentMethods.jsx";
import RedirectNotice from "../components/RedirectNotice.jsx";
import Seo from "../components/Seo.jsx";
import Select from "../components/ui/Select.jsx";
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

// One "Full name" field is quicker to fill than two; the backend keeps first
// and last name apart.
const splitName = (fullName) => {
  const [firstName = "", ...rest] = fullName.trim().split(/\s+/);
  return { firstName, lastName: rest.join(" ") };
};

// Long enough to read the hand-off message before the browser leaves.
const MIN_REDIRECT_NOTICE_MS = 900;
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Leaving our site for PayPal is where buyers hesitate, so the PayPal
// checkout says up front that it's coming. The card checkout is only the
// email, so it has no steps.
function CheckoutSteps() {
  // The middle step names whose page it is, so the hand-off is expected.
  const steps = [
    { label: "Shipping" },
    { label: "Payment", note: "on PayPal" },
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

// PayPal ships to the address saved in the buyer's PayPal account and
// doesn't let them pick another, so a buyer who sends it elsewhere (a gift)
// gives that address here.
const EMPTY_ADDRESS = {
  fullName: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
};

function Field({ label, name, values, onChange, optional, ...props }) {
  const id = `checkout-${name}`;
  return (
    <div className="checkout-field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="checkout-optional"> (optional)</span>}
      </label>
      <input
        id={id}
        className="checkout-input"
        name={name}
        value={values[name]}
        onChange={onChange}
        required={!optional}
        {...props}
      />
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

// Card checkout asks us for the email only: Western Bid passes it on to
// Stripe, whose page then asks for the shipping address and the card.
// PayPal checkout (?pay=paypal) asks for nothing, unless the buyer ships to
// an address other than their PayPal one. Shipping is free everywhere, so
// the country isn't asked; the backend guesses it from the IP.
function CheckoutPage() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { product, isLoading, error } = useProduct(slug);
  const [config, setConfig] = useState(null);
  const [configError, setConfigError] = useState(false);
  // Back from the payment page: the email and quantity are still there.
  const [draft] = useState(() => readCheckoutDraft(slug));
  const [email, setEmail] = useState(draft?.email ?? "");
  const [address, setAddress] = useState(() => ({ ...EMPTY_ADDRESS, ...draft?.address }));
  // PayPal: "home" ships to the address saved in PayPal, "other" to the
  // address typed here.
  const [shipToAddress, setShipToAddress] = useState(draft?.shipToAddress ?? "home");
  const [quantity, setQuantity] = useState(draft?.quantity ?? 1);
  // Where it ships, which sets the shipping price; null means the country
  // the backend guessed from the visitor's IP.
  const [country, setCountry] = useState(draft?.country ?? null);
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

  const shipCountry = country ?? config?.shipToCountry;
  const shipTo = config?.countries.find((c) => c.code === shipCountry);
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
  // The PayPal page (?pay=paypal) or the email-only page. Where cards aren't
  // taken (e.g. Ukraine) the email-only page still shows and pays via PayPal.
  const isPayPal = searchParams.get("pay") === "paypal";
  const regions = shipTo?.regions;

  const switchTo = (method) =>
    setSearchParams(method === "paypal" ? { pay: "paypal" } : {}, { replace: true });

  const handleAddressChange = (event) =>
    setAddress((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleCountryChange = (event) => {
    setCountry(event.target.value);
    setAddress((current) => ({ ...current, state: "" }));
  };

  const pay = async (method) => {
    const isOtherAddress = isPayPal && shipToAddress === "other";
    setPayment({ method, error: null });
    try {
      const [order] = await Promise.all([
        createOrder({
          productSlug: product.slug,
          quantity,
          paymentMethod: method,
          express: !isOtherAddress,
          customer: isOtherAddress
            ? {
                ...splitName(address.fullName),
                address1: address.address1,
                address2: address.address2,
                city: address.city,
                zip: address.zip,
                country: shipCountry,
                state: regions ? address.state : "",
              }
            : {
                ...(isPayPal ? {} : { email: email.trim() }),
                country: shipCountry,
              },
          ...orderTrackingFields(),
        }),
        wait(MIN_REDIRECT_NOTICE_MS),
      ]);
      saveCheckoutDraft(product.slug, {
        email,
        quantity,
        country: shipCountry,
        address,
        shipToAddress,
        method: isPayPal ? "paypal" : "card",
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
    pay(isPayPal || !cardAvailable ? "paypal" : "card");
  };

  const addressProps = { values: address, onChange: handleAddressChange };

  return (
    <>
      <Seo title="Checkout" path={`/checkout/${product.slug}`} noindex />
      <main className="checkout">
        <Link to={`/products/${product.slug}`} className="checkout-back">
          <span aria-hidden="true">←</span> Back to {product.name}
        </Link>
        <h1 className="checkout-title">Checkout</h1>
        {isPayPal && <CheckoutSteps />}
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
              {isPayPal && !cardAvailable && (
                <p className="checkout-region-note">
                  Card payments aren&apos;t available in your region — please pay
                  with PayPal.
                </p>
              )}

              {!isPayPal && (
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              )}

              {isPayPal && (
                <fieldset className="checkout-choice">
                  <legend>Where should we send it?</legend>
                  <label className="checkout-choice-option">
                    <input
                      type="radio"
                      name="shipToAddress"
                      value="home"
                      checked={shipToAddress === "home"}
                      onChange={() => setShipToAddress("home")}
                    />
                    <span>
                      <strong>My home address</strong>
                      <span className="checkout-choice-hint">
                        The one saved in PayPal. Nothing to fill in.
                      </span>
                    </span>
                  </label>
                  <label className="checkout-choice-option">
                    <input
                      type="radio"
                      name="shipToAddress"
                      value="other"
                      checked={shipToAddress === "other"}
                      onChange={() => setShipToAddress("other")}
                    />
                    <span>
                      <strong>A different address</strong>
                      <span className="checkout-choice-hint">For example, a gift.</span>
                    </span>
                  </label>
                </fieldset>
              )}

              {isPayPal && shipToAddress === "other" && (
                <Field label="Full name" name="fullName" autoComplete="name" maxLength={200} {...addressProps} />
              )}

              {isPayPal && shipToAddress === "other" && (
                <div className="checkout-field">
                  <label htmlFor="checkout-country">Country</label>
                  <Select
                    id="checkout-country"
                    name="country"
                    value={shipCountry}
                    onChange={handleCountryChange}
                    autoComplete="country"
                    required
                    options={config.countries.map((c) => ({ value: c.code, label: c.name }))}
                  />
                </div>
              )}

              {isPayPal && shipToAddress === "other" && (
                <>
                  <Field label="Address" name="address1" autoComplete="address-line1" maxLength={200} {...addressProps} />
                  <Field label="Apartment, suite, etc." name="address2" autoComplete="address-line2" maxLength={200} optional {...addressProps} />
                  <div className="checkout-row">
                    <Field label="City" name="city" autoComplete="address-level2" maxLength={100} {...addressProps} />
                    <Field
                      label={shipCountry === "US" ? "ZIP code" : "Postal code"}
                      name="zip"
                      autoComplete="postal-code"
                      maxLength={20}
                      {...addressProps}
                    />
                  </div>
                  {regions && (
                    <div className="checkout-field">
                      <label htmlFor="checkout-state">
                        {shipCountry === "CA" ? "Province" : "State"}
                      </label>
                      <Select
                        id="checkout-state"
                        name="state"
                        value={address.state}
                        onChange={handleAddressChange}
                        autoComplete="address-level1"
                        required
                        options={regions.map((r) => ({ value: r.code, label: r.name }))}
                      />
                    </div>
                  )}
                </>
              )}

              {isPayPal ? (
                <button
                  type="submit"
                  className="checkout-paypal-button"
                  disabled={Boolean(payment) || isSoldOut}
                  aria-label={isSoldOut ? "Sold out" : `Continue to PayPal, ${money(totals.total)}`}>
                  {isSoldOut ? (
                    "Sold out"
                  ) : (
                    <>
                      <span aria-hidden="true">Continue to</span> <PayPalLogo />
                      <span aria-hidden="true">· {money(totals.total)}</span>
                    </>
                  )}
                </button>
              ) : (
                <>
                  <SecureCheckoutLine className="checkout-secure" />
                  <button
                    type="submit"
                    className="checkout-submit"
                    disabled={Boolean(payment) || isSoldOut}>
                    {isSoldOut ? "Sold out" : `Continue to payment · ${money(totals.total)}`}
                  </button>
                </>
              )}
              {isPayPal && <SecureCheckoutBox />}
            </form>

            {isPayPal && (
              <section className="checkout-next" aria-labelledby="checkout-next-title">
                <h2 id="checkout-next-title" className="checkout-next-title">
                  What happens next
                </h2>
                <ol className="checkout-next-list">
                  <li>
                    You log in to PayPal and pay. The payment goes to our partner{" "}
                    <strong>Western Bid</strong>, the name you&apos;ll see in PayPal.
                  </li>
                  <li>
                    We ship your candle to{" "}
                    {shipToAddress === "home"
                      ? "the home address saved in your PayPal account"
                      : "the address above"}
                    .
                  </li>
                  <li>
                    We email your order confirmation. Delivery takes {DELIVERY_TIME}.
                  </li>
                </ol>
              </section>
            )}

            {!isSoldOut && cardAvailable && isPayPal && (
              <div className="checkout-paypal">
                <p className="checkout-paypal-label">Prefer to pay by card?</p>
                <button
                  type="button"
                  className="checkout-switch-button"
                  disabled={Boolean(payment)}
                  onClick={() => switchTo("card")}>
                  Pay by card, Apple Pay or Google Pay
                </button>
              </div>
            )}

            {!isSoldOut && !isPayPal && (
              <p className="checkout-switch">
                Prefer PayPal?{" "}
                <button
                  type="button"
                  className="checkout-switch-link"
                  disabled={Boolean(payment)}
                  onClick={() => switchTo("paypal")}>
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
