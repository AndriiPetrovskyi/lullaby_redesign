import { pageMetadata } from "../../../src/lib/metadata.js";
import { CheckoutView } from "../../../src/views/client.jsx";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return pageMetadata({ path: `/checkout/${slug}`, title: "Checkout", noindex: true });
}

export default function CheckoutPage() {
  return <CheckoutView />;
}
