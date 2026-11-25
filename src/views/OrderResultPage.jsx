import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import { CONTACT_EMAIL, DISPATCH_TIME, DELIVERY_TIME } from "../config/contact.js";
import { getOrderStatus, readCheckoutDraft } from "../services/orders.js";
import { trackEvent } from "../utils/metaPixel.js";
import "./SimplePage.css";
import "./OrderResultPage.css";

const POLL_INTERVAL_MS = 2000;
const POLL_ATTEMPTS = 15;
const PAID_STATUSES = ["PAID", "SHIPPED"];

// The browser half of the Meta Purchase event; the backend sends the server half
// with the same id when the payment notification arrives.
function trackPurchaseOnce(order) {
  const key = `purchase-tracked-${order.id}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // storage unavailable — Meta still dedupes by event id
  }
  trackEvent(
    "Purchase",
    {
      content_ids: [order.productId],
      content_name: order.productName,
      content_type: "product",
      num_items: order.quantity,
      value: order.total,
      currency: order.currency,
      order_id: String(order.number),
    },
    { eventId: `purchase-${order.id}` },
  );
  // GA4's "purchase" comes only from the backend (Measurement Protocol, with
  // this visitor's client/session ids): GA doesn't reliably merge a browser
  // and a server purchase with the same transaction_id, so sending both
  // could double the revenue.
}

function useOrder(orderId, { poll }) {
  const [order, setOrder] = useState(null);
  const [state, setState] = useState(orderId ? "loading" : "missing");

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    let attempts = 0;
    let timer;

    const load = async () => {
      attempts += 1;
      try {
        const data = await getOrderStatus(orderId);
        if (cancelled) return;
        if (!data) return setState("missing");
        setOrder(data);
        if (PAID_STATUSES.includes(data.status)) return setState("paid");
        if (data.status === "REFUNDED" || data.status === "CANCELLED") {
          return setState("closed");
        }
        if (poll && attempts < POLL_ATTEMPTS) {
          timer = setTimeout(load, POLL_INTERVAL_MS);
        } else {
          setState("pending");
        }
      } catch {
        if (!cancelled) setState("pending");
      }
    };
    load();

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, poll]);

  return { order, state };
}

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const { order, state } = useOrder(searchParams.get("order"), { poll: true });

  useEffect(() => {
    if (state === "paid" && order) {
      trackPurchaseOnce(order);
    }
  }, [state, order]);

  return (
    <>
      <Seo title="Thank you" path="/checkout/success" noindex />
      <main className="simple-page">
        {state === "loading" && (
          <>
            <h1 className="h1-heading">Confirming your payment…</h1>
            <div className="simple-page-content" role="status">
              <p>This usually takes a few seconds. Please keep this page open.</p>
            </div>
          </>
        )}

        {state === "paid" && order && (
          <>
            <h1 className="h1-heading">Thank you for your order!</h1>
            <div className="simple-page-content">
              <p>
                Your payment went through and order{" "}
                <strong className="order-result-number">#{order.number}</strong> is
                confirmed: {order.quantity} × {order.productName}, $
                {order.total.toFixed(2)} {order.currency}.
              </p>
              <p>
                We&apos;ll pour, pack and ship it within {DISPATCH_TIME}; delivery
                takes {DELIVERY_TIME}. You&apos;ll get a payment receipt by email,
                and we&apos;ll send your tracking number once it ships. The charge
                will appear as &ldquo;WESTERN BID&rdquo; on your card or PayPal
                statement: they are our payment partner.
              </p>
              <p>
                Questions? Write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and mention
                your order number.
              </p>
              <div className="order-result-actions">
                <Link to="/products">Continue shopping</Link>
              </div>
            </div>
          </>
        )}

        {(state === "pending" || state === "closed" || state === "missing") && (
          <>
            <h1 className="h1-heading">We&apos;re checking your payment</h1>
            <div className="simple-page-content">
              <p>
                We haven&apos;t received the payment confirmation
                {order ? (
                  <>
                    {" "}for order <strong className="order-result-number">#{order.number}</strong>
                  </>
                ) : null}{" "}
                yet. If you completed the payment, you&apos;ll get a receipt by
                email and we&apos;ll confirm your order shortly — there&apos;s no
                need to pay again.
              </p>
              <p>
                Not sure it went through? Write to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                {order ? ` with order number #${order.number}` : ""} and we&apos;ll
                check for you.
              </p>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export function OrderCancelledPage() {
  const [searchParams] = useSearchParams();
  const { order } = useOrder(searchParams.get("order"), { poll: false });

  return (
    <>
      <Seo title="Payment cancelled" path="/checkout/cancel" noindex />
      <main className="simple-page">
        <h1 className="h1-heading">Payment cancelled</h1>
        <div className="simple-page-content">
          <p>No payment was taken. Your candle is still waiting for you.</p>
          <p>
            Unsure about the payment page? It&apos;s run by our payment partner
            Western Bid through Stripe, which is why you see their name there and
            on your statement. Prefer PayPal? There&apos;s a PayPal button on
            the checkout page too.
          </p>
          <div className="order-result-actions">
            {/* PayPal goes straight from the product page, so it leads back
                there; card buyers go back to the checkout. */}
            {order &&
              (readCheckoutDraft(order.productSlug)?.method === "paypal" ? (
                <Link to={`/products/${order.productSlug}`}>
                  Back to {order.productName}
                </Link>
              ) : (
                <Link to={`/checkout/${order.productSlug}`}>
                  Back to checkout — {order.productName}
                </Link>
              ))}
            <Link to="/products">Browse all scents</Link>
          </div>
          <p>
            Something not working? Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we&apos;ll
            help.
          </p>
        </div>
      </main>
    </>
  );
}
