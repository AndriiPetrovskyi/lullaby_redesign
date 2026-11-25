import { pageMetadata } from "../../src/lib/metadata.js";
import { TermsView } from "../../src/views/client.jsx";

export const metadata = pageMetadata({
  path: "/terms",
  title: "Terms & Conditions",
  description:
    "Lullaby's terms and conditions — ordering, payment, shipping, returns, and candle care.",
});

export default function TermsPage() {
  return <TermsView />;
}
