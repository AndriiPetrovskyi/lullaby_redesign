import Seo from "../components/Seo.jsx";
import "./SimplePage.css";

function PrivacyPolicyPage() {
  return (
    <>
      <Seo
        title="Privacy Policy"
        description="How Lullaby collects, uses, and protects your information."
        path="/privacy-policy"
      />
      <main className="simple-page">
        <h1 className="h1-heading">Privacy Policy</h1>
      </main>
    </>
  )
}

export default PrivacyPolicyPage
