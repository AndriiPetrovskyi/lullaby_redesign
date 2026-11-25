import { pageMetadata } from "../../src/lib/metadata.js";
import { ProductsView } from "../../src/views/client.jsx";

export const metadata = pageMetadata({
  path: "/products",
  title: "All Scents",
  description:
    "Browse every Lullaby scent — hand-poured candles in handmade gypsum vessels, each with a handwritten message in a vial tucked inside.",
});

export default function ProductsPage() {
  return <ProductsView />;
}
