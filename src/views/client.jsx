"use client";

import dynamic from "next/dynamic";
import BootLoader from "../components/BootLoader.jsx";

// The current page components render in the browser only (they read window
// and localStorage on first render). The redesign replaces them with server
// components page by page.
const clientOnly = (load) => dynamic(load, { ssr: false, loading: () => <BootLoader /> });

export const HomeView = clientOnly(() => import("./HomePage.jsx"));
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
