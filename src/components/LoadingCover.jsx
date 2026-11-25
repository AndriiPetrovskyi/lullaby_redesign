// The loader over a photo or video while it loads, centred in its parent
// (which needs position: relative).
import PotLoader from "./PotLoader.jsx";
import styles from "./LoadingCover.module.css";

function LoadingCover() {
  return (
    <div className={styles.cover}>
      <PotLoader size={36} />
    </div>
  );
}

export default LoadingCover;
