import Seo from "../components/Seo.jsx";
import "./SimplePage.css";

function TermsPage() {
  return (
    <>
      <Seo
        title="Terms & Conditions"
        description="Lullaby's terms and conditions — shipping, orders, and use of this site."
        path="/terms"
      />
      <main className="simple-page">
        <h1 className="h1-heading">Terms & Conditions</h1>
      </main>
    </>
  )
}

export default TermsPage
