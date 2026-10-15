import { Link } from "react-router-dom";
import GuaranteesMarquee from "./GuaranteesMarquee.jsx";
import "./HomeClosing.css";

function HomeClosing() {
  return (
    <div className="home-closing">
      <GuaranteesMarquee />

      <div className="home-cta">
        <p className="home-cta-eyebrow">Light it. Gift it. Keep it.</p>
        <h2 className="home-cta-title">
          <span className="home-cta-title-script">Find your</span>
          <span className="home-cta-title-bold">scent</span>
        </h2>
        <Link to="/products" className="home-cta-button">
          Shop all scents
        </Link>
      </div>
    </div>
  );
}

export default HomeClosing;
