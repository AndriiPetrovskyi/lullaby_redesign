"use client";

// A next/image photo with our loader over it until it has loaded, then it
// fades in. Takes the same props as <Image>.
//
// - fill: the photo fills its parent (as in ImageFrame), which needs
//   position: relative; the loader centres in the parent.
// - otherwise (width and height): wrapped in a <span>, the loader centres on it.
//
// First-screen photos (priority) show without the loader: they load first
// anyway, and hiding them until JavaScript runs would only show a blank longer.

import { useState } from "react";
import Image from "next/image";
import LoadingCover from "./LoadingCover.jsx";
import styles from "./LoadingImage.module.css";

function LoadingImage({ alt, className, priority, fill, ...props }) {
  const [loaded, setLoaded] = useState(false);

  if (priority) {
    return <Image {...props} alt={alt} fill={fill} priority className={className} />;
  }

  const imageClass = `${className || ""} ${styles.image} ${loaded ? "" : styles.hidden}`;
  const image = (
    <Image {...props} alt={alt} fill={fill} className={imageClass} onLoad={() => setLoaded(true)} />
  );

  if (fill) {
    return (
      <>
        {image}
        {!loaded && <LoadingCover />}
      </>
    );
  }

  return (
    <span className={styles.box}>
      {image}
      {!loaded && <LoadingCover />}
    </span>
  );
}

export default LoadingImage;
