import { pageMetadata } from "../src/lib/metadata.js";
import { HomeView } from "../src/views/client.jsx";

export const metadata = pageMetadata({ path: "/" });

export default function HomePage() {
  return <HomeView />;
}
