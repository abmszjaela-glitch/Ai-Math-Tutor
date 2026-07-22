// src/component/StaggerContainer.jsx
import { motion } from 'framer-motion';

export const StaggerContainer = ({ children, className = '', staggerDelay = 0.15 }) => (
  <motion.div
    className={className}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={{
      hidden: {},
      visible: {
        transition: { staggerChildren: staggerDelay },
      },
    }}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 30 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
      },
    }}
  >
    {children}
  </motion.div>
);