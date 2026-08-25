import { useRef, useState } from 'react'
import './MutableVideo.css'

function MutableVideo({ src, className, ...videoProps }) {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)

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
        src={src}
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
        aria-label={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
      >
        {isMuted ? '🔇' : '🔊'}
      </button>
    </div>
  )
}

export default MutableVideo
