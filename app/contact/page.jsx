import { pageMetadata } from "../../src/lib/metadata.js";
import { ContactView } from "../../src/views/client.jsx";

export const metadata = pageMetadata({
  path: "/contact",
  title: "Contact Us",
  description:
    "Get in touch with Lullaby — questions about orders, direct orders, shipping, or anything else.",
});

export default function ContactPage() {
  return <ContactView />;
}
