import handmadeImage from "../assets/handmade.jpg"
import sliderImage from "../assets/slider/1.jpg"
import flowerImage from "../assets/fl3.jpeg"
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
    video: processVideo,
  },
  {
    id: 2,
    name: "Made by hand",
    description: "Small imperfections, soft variations, and the touch of the maker make every piece unique.",
    price: 640,
    image: sliderImage,
    video: video2,
  },
  {
    id: 3,
    name: "A little light",
    description: "When one ritual ends, another begins — every candle leaves something behind.",
    price: 560,
    image: flowerImage,
    video: processVideo,
  },
  {
    id: 4,
    name: "A gift before the gift",
    description: "The best gifts say what words can't.",
    price: 720,
    image: boxImage,
    video: video2,
  },
]

export default products
