import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import boxImage from "../assets/box.webp";
import gardenVesselImage from "../assets/fl3.jpeg";
import vesselImage from "../assets/fl1.webp";
import handmadeImage from "../assets/handmade.jpg";
import "./AboutPage.css";

// TODO: swap these for real About-page photography when it's ready —
// these are existing brand images reused as thematically-fitting placeholders.
const STORY_SECTIONS = [
  {
    image: boxImage,
    alt: "A Lullaby candle nestled in its gift box",
    paragraphs: [
      "We have always believed that the best gifts are more than beautiful things. They are little reminders of love, care, and someone taking the time to think of you.",
      "That is how Lullaby began.",
    ],
  },
  {
    image: gardenVesselImage,
    alt: "A Lullaby candle vessel in the garden",
    paragraphs: [
      "We wanted to create a candle that feels special to give, beautiful to keep, and meaningful to light. Something with a little secret of its own.",
      "So we hid a little note inside — a handwritten wish or fortune for whoever lights it.",
    ],
  },
  {
    image: vesselImage,
    alt: "A candle vessel planted with a flower, given a second life",
    paragraphs: [
      "And when the candle is finished, its vessel can have a second life. Fill it with soil, plant a little flower or succulent, and watch something living grow from what was once a simple gift.",
      "There is something beautiful about that idea to us: giving someone not just a candle, but a little moment of warmth, a few kind words, and a home for something alive.",
    ],
  },
  {
    image: handmadeImage,
    alt: "A Lullaby candle being poured and finished by hand",
    paragraphs: [
      "Every Lullaby candle is made by hand, from the gypsum vessel to the final detail. And perhaps there is a little family tradition in that. Years ago, my grandfather made candles by hand and taught me the craft.",
      "Today, we carry that tradition forward in our own way — creating objects that invite you to slow down, enjoy the moment, and share a little warmth with someone who matters.",
    ],
  },
];

function AboutPage() {
  return (
    <>
      <Seo
        title="About Us"
        description="The story behind Lullaby — handmade candles in gypsum vessels, poured with natural soy wax, with a handwritten wish or fortune hidden inside every one."
        path="/about"
      />
      <main className="about-page">
        <div className="about-page-inner">
          <h1 className="about-page-title">
            <span className="about-page-title-script">The Lullaby</span>
            <span className="about-page-title-bold">Story</span>
          </h1>
        </div>

        {STORY_SECTIONS.map((section, i) => (
          <section
            className={
              i % 2 === 1
                ? "about-page-story about-page-story--reverse"
                : "about-page-story"
            }
            key={section.image}>
            <img
              className="about-page-story-media"
              src={section.image}
              alt={section.alt}
            />
            <div className="about-page-story-text">
              {section.paragraphs.map((paragraph) => (
                <p className="body-text about-page-story-paragraph" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}

        <div className="about-page-inner">
          <section className="about-page-closing">
            <p className="about-page-closing-text">Light it. Make a wish.</p>
            <Link to="/products" className="about-page-cta">
              Shop the Collection
            </Link>
          </section>
        </div>
      </main>
    </>
  );
}

export default AboutPage;
