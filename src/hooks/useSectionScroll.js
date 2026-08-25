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

    // Only the snapped section stack (index 0..sectionCount-1) is under our
    // control. Once a wheel/key tick would move past its edges, let the
    // browser scroll natively so content below the stack (e.g. the footer)
    // stays reachable instead of being trapped by preventDefault().
    const handleWheel = (e) => {
      if (isAnimatingRef.current) {
        e.preventDefault()
        return
      }
      const index = currentIndex()
      if (index < 0 || index > sectionCount - 1) return
      const target = index + (e.deltaY > 0 ? 1 : -1)
      if (target < 0 || target > sectionCount - 1) return
      e.preventDefault()
      animateTo(target)
    }

    const handleKeyDown = (e) => {
      if (isAnimatingRef.current) return
      const index = currentIndex()
      if (index < 0 || index > sectionCount - 1) return
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (index >= sectionCount - 1) return
        e.preventDefault()
        animateTo(index + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (index <= 0) return
        e.preventDefault()
        animateTo(index - 1)
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
