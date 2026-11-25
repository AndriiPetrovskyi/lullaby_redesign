"use client";

import dynamic from "next/dynamic";
import BootLoader from "../../src/components/BootLoader.jsx";

// Browser only: the current pages read window, localStorage and the router
// on first render.
const ClientRoot = dynamic(() => import("../../src/ClientRoot.jsx"), {
  ssr: false,
  loading: () => <BootLoader />,
});

export default function ClientApp() {
  return <ClientRoot />;
}
