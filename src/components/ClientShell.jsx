"use client";

import dynamic from "next/dynamic";
import BootLoader from "./BootLoader.jsx";

const SiteShell = dynamic(() => import("./SiteShell.jsx"), {
  ssr: false,
  loading: () => <BootLoader />,
});

export default function ClientShell({ children }) {
  return <SiteShell>{children}</SiteShell>;
}
