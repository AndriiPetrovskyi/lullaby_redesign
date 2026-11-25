import { StrictMode } from "react";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import "./utils/trafficSource.js";
import App from "./App.jsx";

// The whole storefront, rendered in the browser as before the move to Next.
// Pages move out of it into their own Next routes during the redesign.
export default function ClientRoot() {
  return (
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>
  );
}
