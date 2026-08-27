import "./LoadingScreen.css";

function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-label="Завантаження">
      <span className="loading-screen-text loading-screen-text--outline" aria-hidden="true">
        Lullaby
      </span>
      <span className="loading-screen-text loading-screen-text--fill" aria-hidden="true">
        Lullaby
      </span>
    </div>
  );
}

export default LoadingScreen;
