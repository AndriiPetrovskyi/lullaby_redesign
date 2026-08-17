import { motion } from 'framer-motion'

function AnimatedSection({ className, children, direction = 1 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 120 * direction }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default AnimatedSection
