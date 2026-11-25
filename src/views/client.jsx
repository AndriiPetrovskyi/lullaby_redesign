"use client";

import dynamic from "next/dynamic";
import { HelmetProvider } from "react-helmet-async";
import BootLoader from "../components/BootLoader.jsx";

// The pages not yet redesigned: rendered in the browser only (they read
// window and localStorage on first render), with their <Seo> head tags and
// room under the header. The redesign replaces them page by page.
function clientOnly(load) {
  const Page = dynamic(load, { ssr: false, loading: () => <BootLoader /> });
  return function LegacyPage(props) {
    return (
      <HelmetProvider>
        <div className="legacy-page">
          <Page {...props} />
        </div>
      </HelmetProvider>
    );
  };
}

export const ProductsView = clientOnly(() => import("./ProductsPage.jsx"));
export const ProductView = clientOnly(() => import("./ProductPage.jsx"));
export const CheckoutView = clientOnly(() => import("./CheckoutPage.jsx"));
export const OrderSuccessView = clientOnly(() =>
  import("./OrderResultPage.jsx").then((m) => m.OrderSuccessPage),
);
export const OrderCancelledView = clientOnly(() =>
  import("./OrderResultPage.jsx").then((m) => m.OrderCancelledPage),
);
export const AboutView = clientOnly(() => import("./AboutPage.jsx"));
export const ContactView = clientOnly(() => import("./ContactPage.jsx"));
export const TermsView = clientOnly(() => import("./TermsPage.jsx"));
export const PrivacyPolicyView = clientOnly(() => import("./PrivacyPolicyPage.jsx"));
export const NotFoundView = clientOnly(() => import("./NotFoundPage.jsx"));
