import { useEffect, useRef, useState } from 'react'
import './MutableVideo.css'

// Videos only start downloading once they come near the screen (the poster
// frame shows until then) and pause while scrolled away — a product page
// used to pull every video on load, ~20 MB before the buyer scrolled at all.
function MutableVideo({ src, poster, className, ...videoProps }) {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isNear, setIsNear] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!('IntersectionObserver' in window)) {
      setIsNear(true)
      return
    }

    const loader = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true)
          loader.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    const player = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    })
    loader.observe(video)
    player.observe(video)
    return () => {
      loader.disconnect()
      player.disconnect()
    }
  }, [])

  const toggleMute = () => {
    setIsMuted((muted) => {
      const next = !muted
      if (videoRef.current) videoRef.current.muted = next
      return next
    })
  }

  return (
    <div className="mutable-video-wrap">
      <video
        ref={videoRef}
        className={className}
        src={isNear ? src : undefined}
        poster={poster}
        preload="none"
        autoPlay
        loop
        muted
        playsInline
        {...videoProps}
      />
      <button
        type="button"
        className="mutable-video-mute"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

export default MutableVideo
