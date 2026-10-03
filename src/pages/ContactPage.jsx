import Seo from "../components/Seo.jsx";
import "./SimplePage.css";

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with Lullaby — questions about orders, custom candles, or anything else."
        path="/contact"
      />
      <main className="simple-page">
        <h1 className="h1-heading">Contact Us</h1>
      </main>
    </>
  )
}

export default ContactPage
