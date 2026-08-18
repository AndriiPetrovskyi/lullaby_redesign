import handmadeImage from "../assets/handmade.jpg"
import sliderImage from "../assets/slider/1.jpg"
import sliderImage2 from "../assets/slider/11.jpg"
import seedsImage from "../assets/slider/3.png"
import flowerImage from "../assets/fl3.jpeg"
import flowerImage2 from "../assets/fl1.PNG"
import flowerImage3 from "../assets/fl2.PNG"
import boxImage from "../assets/box.jpg"
import processVideo from "../assets/process.mp4"
import video2 from "../assets/video2.MP4"

const products = [
  {
    id: 1,
    name: "Lullaby rituals",
    description: "Some moments don't need words — just a gentle glow and the feeling of home.",
    price: 590,
    image: handmadeImage,
    gallery: [handmadeImage, sliderImage, seedsImage],
    video: processVideo,
  },
  {
    id: 2,
    name: "Made by hand",
    description: "Small imperfections, soft variations, and the touch of the maker make every piece unique.",
    price: 640,
    image: sliderImage,
    gallery: [sliderImage, sliderImage2, boxImage],
    video: video2,
  },
  {
    id: 3,
    name: "Island Escape — Tropical Floral Candle",
    description: `Imagine the first morning of your island getaway. Sunlight filters through palm leaves, tropical flowers bloom in the warm air, and the breeze carries hints of citrus and fresh greenery. Light this candle whenever you need a little escape.

🤍 Why you'll love it

A bright tropical fragrance that's fresh rather than overly sweet. Airy florals, juicy lime and soft green notes create the feeling of endless summer.

⸻

🌿 A candle that grows

Inside every candle is a small surprise — a unique packet of seeds. Plant them after your candle is finished and give your vessel a beautiful second life.`,
    fragranceNotes: {
      top: "Honeydew Melon, Lime, Agave",
      heart: "Green Florals, Green Leaves",
      base: "Powder, Violet",
    },
    price: 560,
    image: flowerImage,
    gallery: [flowerImage, flowerImage2, flowerImage3],
    video: processVideo,
  },
  {
    id: 4,
    name: "A gift before the gift",
    description: "The best gifts say what words can't.",
    price: 720,
    image: boxImage,
    gallery: [boxImage, handmadeImage, sliderImage],
    video: video2,
  },
]

export default products
