import { Days_One, Manrope, Pattaya, Rubik } from "next/font/google";
import "../src/styles/index.css";
import ClientShell from "../src/components/ClientShell.jsx";
import OrderingPausedBanner from "../src/components/OrderingPausedBanner.jsx";
import Footer from "../src/components/site/Footer.jsx";
import Header from "../src/components/site/Header.jsx";
import { DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "../src/config/seo.js";

// Fonts: Next downloads them at build time and serves them from this site.
// In CSS: var(--font-heading), var(--font-body), var(--font-logo), var(--font-accent).
const headingFont = Days_One({ weight: "400", subsets: ["latin"], variable: "--font-heading" });
const bodyFont = Manrope({ subsets: ["latin"], variable: "--font-body" });
const logoFont = Rubik({ weight: "600", subsets: ["latin"], variable: "--font-logo" });
// Handwritten, for single accent words ("Rituals" in the logo)
const accentFont = Pattaya({ weight: "400", subsets: ["latin"], variable: "--font-accent" });

const DEFAULT_TITLE = `${SITE_NAME} — Handmade Scented Candles`;

// Defaults for every page; each page fills in its own.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fff3e3",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${logoFont.variable} ${accentFont.variable}`}>
      <body>
        <noscript>This site needs JavaScript enabled to work.</noscript>
        <OrderingPausedBanner />
        <Header />
        <ClientShell>{children}</ClientShell>
        <Footer />
      </body>
    </html>
  );
}
