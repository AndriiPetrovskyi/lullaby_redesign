import { pageMetadata } from "../../../src/lib/metadata.js";
import { OrderSuccessView } from "../../../src/views/client.jsx";

export const metadata = pageMetadata({ path: "/checkout/success", title: "Thank you", noindex: true });

export default function OrderSuccessPage() {
  return <OrderSuccessView />;
}
