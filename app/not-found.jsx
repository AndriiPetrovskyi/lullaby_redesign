import { pageMetadata } from "../src/lib/metadata.js";
import { NotFoundView } from "../src/views/client.jsx";

export const metadata = pageMetadata({ path: "/404", title: "Page Not Found", noindex: true });

export default function NotFound() {
  return <NotFoundView />;
}
