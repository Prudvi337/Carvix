
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedPageProps {
  children: ReactNode;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
}

const animations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 }
  },
  slide: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.3 }
  },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { duration: 0.3 }
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
    transition: {}
  }
};

const AnimatedPage = ({ children, animation = 'fade' }: AnimatedPageProps) => {
  const animationConfig = animations[animation];
  
  return (
    <motion.div
      initial={animationConfig.initial}
      animate={animationConfig.animate}
      exit={animationConfig.exit}
      transition={animationConfig.transition}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;
