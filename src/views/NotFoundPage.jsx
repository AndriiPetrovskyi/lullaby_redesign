import Link from "next/link";
import Seo from "../components/Seo.jsx";
import "./SimplePage.css";

function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" path="/404" noindex />
      <main className="simple-page">
        <h1 className="h1-heading">404</h1>
        <p className="body-text">
          This page doesn't exist. <Link href="/">Back to home</Link>.
        </p>
      </main>
    </>
  );
}

export default NotFoundPage;
