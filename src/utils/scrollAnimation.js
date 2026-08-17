export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { amount: 0.6 },
  transition: { duration: 0.5, ease: 'easeOut', delay },
})

export const scaleDown = (delay = 0) => ({
  initial: { scale: 1.15 },
  whileInView: { scale: 1 },
  viewport: { amount: 0.6 },
  transition: { duration: 0.8, ease: 'easeOut', delay },
})
