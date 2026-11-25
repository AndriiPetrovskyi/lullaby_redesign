import { pageMetadata } from "../../../src/lib/metadata.js";
import { OrderCancelledView } from "../../../src/views/client.jsx";

export const metadata = pageMetadata({ path: "/checkout/cancel", title: "Payment cancelled", noindex: true });

export default function OrderCancelledPage() {
  return <OrderCancelledView />;
}
