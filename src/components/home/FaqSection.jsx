// Home, last section: "Before you order", questions and answers. Each is a
// <details>: the browser opens and closes it, no JavaScript needed.
import {
  DAMAGE_REPORT_HOURS,
  DELIVERY_TIME,
  DISPATCH_TIME,
  FREE_SHIPPING_REGIONS,
} from "../../config/contact.js";
import MoreLink from "../MoreLink.jsx";
import styles from "./FaqSection.module.css";

// `answer`: one paragraph per item
const questions = [
  {
    question: "What is the gift made of?",
    answer: [
      "The candle: soy wax with a cotton wick, about 40 hours of burning.",
      "The vessel: gypsum, a natural mineral. We pour, sand and paint each one by hand, then seal it, so it's washable. Once the candle is gone, it lives on: for a plant, jewelry or little things.",
      "The vial: glass, with a cork stopper.",
      "The box: a black gift box you can keep for little things.",
    ],
  },
  {
    question: "Do you write the note by hand?",
    answer: [
      "Yes. You give us the text when you order, and we write it out by hand on a slip of paper, roll it up and put it in a glass vial with a cork. No printer involved.",
    ],
  },
  {
    question: "What can I write in the note?",
    answer: [
      "Anything: a declaration, a thank-you, an inside joke or just “happy birthday”. Up to 100 characters. We don't edit or add anything; the words are all yours.",
    ],
  },
  {
    question: "Can you send the gift straight to the recipient?",
    answer: [
      "Yes. Enter their address on the payment page. There's no price inside the box.",
    ],
  },
  {
    question: "When will it ship?",
    answer: [
      `Within ${DISPATCH_TIME}. Delivery takes ${DELIVERY_TIME}, and shipping is free to ${FREE_SHIPPING_REGIONS}.`,
    ],
  },
  {
    question: "What if the vessel breaks on the way?",
    answer: [
      `Unlikely: its walls are 5–8 mm thick, and it sits snugly in the box insert. But if it does, send us a photo within ${DAMAGE_REPORT_HOURS} hours of delivery and we'll replace the gift.`,
    ],
  },
  {
    question: "How do I pay?",
    answer: [
      "By card (including Apple Pay and Google Pay, where available) or PayPal. Payment goes securely through our payment partner Western Bid, so the charge shows as “WESTERN BID” on your statement.",
    ],
  },
];

function FaqSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Before you order</h2>

      <div className={styles.list}>
        {questions.map((item) => (
          <details key={item.question} className={styles.item}>
            <summary className={styles.question}>{item.question}</summary>
            <div className={styles.answer}>
              {item.answer.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </details>
        ))}
      </div>

      <MoreLink href="/products" className={styles.button}>
        Choose a candle
      </MoreLink>
    </section>
  );
}

export default FaqSection;
