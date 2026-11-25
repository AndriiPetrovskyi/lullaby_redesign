import { pageMetadata } from "../../src/lib/metadata.js";
import { AboutView } from "../../src/views/client.jsx";

export const metadata = pageMetadata({
  path: "/about",
  title: "About Us",
  description:
    "The story behind Lullaby — handmade candles in gypsum vessels, poured with natural soy wax, with a handwritten message in a vial tucked inside every one.",
});

export default function AboutPage() {
  return <AboutView />;
}
