'use client';

import { motion } from 'framer-motion';

export const Bubble = ({ delay = 0, left = 50, size = 10 }: { delay?: number; left?: number; size?: number }) => {
  return (
    <motion.div
      initial={{ y: 300, opacity: 0.6 }}
      animate={{ y: -200, opacity: 0 }}
      transition={{
        duration: 10,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      style={{
        position: 'absolute',
        left: `${left}%`,
        bottom: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: 'white',
        opacity: 0.3,
        filter: 'blur(1px)',
      }}
    />
  );
};
