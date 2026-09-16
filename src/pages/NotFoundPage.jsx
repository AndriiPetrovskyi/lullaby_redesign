import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";

function NotFoundPage() {
  return (
    <>
      <Seo title="Page Not Found" path="/404" noindex />
      <main>
        <h1 className="h1-heading">404</h1>
        <p className="body-text">
          This page doesn't exist. <Link to="/">Back to home</Link>.
        </p>
      </main>
    </>
  );
}

export default NotFoundPage;
