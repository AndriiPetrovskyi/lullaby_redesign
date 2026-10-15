// Real customer reviews only: the customer's own words (trim or fix typos,
// never rewrite), shared with their permission. `productSlug: null` shows the
// review on every product page.
//
// {
//   id: "emily-r-2026-09",
//   productSlug: "sunwashed",
//   name: "Emily R.",
//   location: "USA",
//   rating: 5,
//   text: "…",
//   date: "2026-09-14",
//   source: "Instagram",
// }
export const REVIEWS = [];

// Layout preview for `npm run dev` only — invented texts, never rendered in
// production builds (the DEV check strips them from the bundle). Do not move
// these into REVIEWS.
const PREVIEW_TEXTS = [
  ["Jessica M.", 5, "Got this for my mom and she loved it. The box was really nice, so I didnt have to wrap anything. The little note inside was a cute surprise too."],
  ["Emily R.", 5, "Very pretty candle! You can see its handmade, which I like. It looks even better in real life and smells really nice."],
  ["Ashley T.", 5, "Bought this for my friend birthday. It came ready to give as a gift which was great because I had no time to prepare anything. She loved the little message inside."],
  ["Lauren B.", 5, "The pot is so pretty, not like the usual candle jars. You can tell someone actually made it by hand. I almost dont want to burn it lol."],
  ["Megan C.", 5, "Such a nice gift idea. Everything was packed nicely and the little note made it feel more personal. Would buy again for a birthday."],
  ["Amanda P.", 5, "I ordered this for my sister and she was very happy with it. The candle smells good and the box looks lovely. No need to buy extra wrapping paper."],
  ["Rachel W.", 5, "Really cute candle. I like that the pot is handmade and not just a normal glass jar. The note was a nice little extra, didnt expect that."],
  ["Nicole D.", 5, "Got it as a housewarming gift. It looks beautiful and was already packed so nicely. Made gift giving very easy for me."],
  ["Samantha K.", 5, "The candle is lovely and the packaging is very nice. I bought it as a gift and honestly it looked more expensive than I expected."],
  ["Kelly F.", 5, "My friend really liked the little note inside. Its such a small thing but makes the gift feel different. The candle itself is also beautiful."],
  ["Lauren H.", 5, "Came well packed and everything was fine. The handmade pot is my favorite part. It has little details that make it feel special."],
  ["Molly S.", 5, "Bought this for my mum. She likes candles and pretty things for the house, so it was perfect. The box was already nice enough to give as it is."],
  ["Daniel R.", 4, "Nice candle and very pretty packaging. I thought the smell would be a bit stronger but its still nice. Got it for my wife and she liked it."],
  ["Katie L.", 4, "The pot looks really nice and you can see its handmade. The color was a little different than I expected from the photos, but still a nice gift."],
  ["Sarah J.", 4, "Bought this as a gift for a friend. The box was great and I liked the little note. Shipping took a bit longer than I hoped but the candle arrived safe."],
];

const SAMPLE_REVIEWS = import.meta.env.DEV
  ? PREVIEW_TEXTS.map(([name, rating, text], i) => ({
      id: `preview-${i}`,
      productSlug: null,
      name,
      location: "Preview only",
      rating,
      text,
      date: "2026-10-01",
      source: "Preview",
    }))
  : [];

export function getProductReviews(slug) {
  const pool = REVIEWS.length === 0 ? SAMPLE_REVIEWS : REVIEWS;
  return pool.filter(
    (review) => review.productSlug === null || review.productSlug === slug,
  );
}
