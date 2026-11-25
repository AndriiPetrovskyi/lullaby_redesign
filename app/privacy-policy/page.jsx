import { pageMetadata } from "../../src/lib/metadata.js";
import { PrivacyPolicyView } from "../../src/views/client.jsx";

export const metadata = pageMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy",
  description:
    "How Lullaby collects, uses, and protects your information — including analytics and advertising cookies.",
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyView />;
}
