import { Link } from "react-router-dom";
import Seo from "../components/Seo.jsx";
import boxImage from "../assets/box.jpg";
import seedsImage from "../assets/fl3.jpeg";
import vesselImage from "../assets/fl1.PNG";
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
    image: seedsImage,
    alt: "Seeds hidden inside every Lullaby candle",
    paragraphs: [
      "We wanted to create a candle that feels special to give, beautiful to keep, and meaningful to light. But we didn't want its story to end when the flame went out.",
      "So we added seeds.",
    ],
  },
  {
    image: vesselImage,
    alt: "A candle vessel planted with a flower, given a second life",
    paragraphs: [
      "When the candle is finished, its vessel gets a second life. You can fill it with soil, plant the seeds, and watch something living grow from what was once a simple gift.",
      "There is something beautiful about that idea to us: giving someone not just a candle, but a little moment of warmth that can eventually become something alive.",
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
        description="The story behind Lullaby — handmade candles in gypsum vessels, poured with natural coconut wax, with a packet of seeds hidden inside every one."
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
            <p className="about-page-closing-text">Light it. Then grow it.</p>
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
