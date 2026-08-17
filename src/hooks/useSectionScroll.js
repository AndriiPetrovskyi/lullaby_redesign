import { useEffect, useRef } from 'react'

const easeOutCubic = (t) => 1 - (1 - t) ** 3

export function useSectionScroll(sectionCount, { duration = 1600, enabled = true } = {}) {
  const isAnimatingRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const animateTo = (targetIndex) => {
      const clamped = Math.max(0, Math.min(sectionCount - 1, targetIndex))
      const startY = window.scrollY
      const endY = clamped * window.innerHeight
      if (startY === endY) return

      isAnimatingRef.current = true
      const startTime = performance.now()

      const step = (now) => {
        const t = Math.min((now - startTime) / duration, 1)
        window.scrollTo(0, startY + (endY - startY) * easeOutCubic(t))

        if (t < 1) {
          requestAnimationFrame(step)
        } else {
          isAnimatingRef.current = false
        }
      }

      requestAnimationFrame(step)
    }

    const currentIndex = () => Math.round(window.scrollY / window.innerHeight)

    const handleWheel = (e) => {
      e.preventDefault()
      if (isAnimatingRef.current) return
      animateTo(currentIndex() + (e.deltaY > 0 ? 1 : -1))
    }

    const handleKeyDown = (e) => {
      if (isAnimatingRef.current) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        animateTo(currentIndex() + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        animateTo(currentIndex() - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [sectionCount, duration, enabled])
}
