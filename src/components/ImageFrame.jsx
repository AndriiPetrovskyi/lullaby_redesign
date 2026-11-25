// A frame (mask) for a photo. The frame has its own size; the photo inside
// can be enlarged (scale) and moved (x, y); whatever leaves the frame is cut.
//
//   <ImageFrame
//     src="/images/pots.jpg"
//     alt="Gypsum vessels on a table"
//     width="100%"
//     ratio="21/9"       // a wide strip on a laptop
//     mobileRatio="4/5"  // a taller frame on a phone
//     scale={1.2}        // 20% larger
//     x={30} y={60}      // the point of interest, % from the left and top
//   />

import LoadingImage from "./LoadingImage.jsx";
import styles from "./ImageFrame.module.css";

function ImageFrame({
  src,
  alt,
  // Frame size, any CSS value; `ratio` ("16/9") instead of height.
  width = "100%",
  height,
  ratio,
  // On a phone; the laptop values when not given.
  mobileWidth,
  mobileHeight,
  mobileRatio,
  // 1 fills the frame exactly; never less, or the frame shows gaps.
  scale = 1,
  // The point kept in view, in percent (50, 50 is the centre).
  x = 50,
  y = 50,
  // How wide the frame shows, so the browser picks a small enough file.
  sizes = "100vw",
  // Load at once (for a page's first screen).
  priority = false,
}) {
  const safeScale = Math.max(scale, 1);
  const position = `${x}% ${y}%`;
  // With only a ratio on a phone, the height comes from it, not from the laptop height.
  const mobileHeightValue = mobileHeight || (mobileRatio ? "auto" : undefined);

  const frameStyle = {
    "--frame-width": width,
    "--frame-height": height || "auto",
    "--frame-ratio": ratio || "auto",
    "--frame-mobile-width": mobileWidth,
    "--frame-mobile-height": mobileHeightValue,
    "--frame-mobile-ratio": mobileRatio,
  };

  const imageStyle = {
    objectFit: "cover",
    objectPosition: position,
    transform: `scale(${safeScale})`,
    transformOrigin: position,
  };

  return (
    <div className={styles.frame} style={frameStyle}>
      <LoadingImage src={src} alt={alt} fill sizes={sizes} priority={priority} style={imageStyle} />
    </div>
  );
}

export default ImageFrame;
