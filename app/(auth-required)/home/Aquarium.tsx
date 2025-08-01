'use client';

import { Box } from "@mui/material";
import { motion } from 'framer-motion';
import Image from "next/image";
import { Bubble } from "./Bubble";

export const Aquarium = ({fishImgUrl} : {fishImgUrl: string | null}) => {
  return (
    <Box
      sx={{
        width: 500,
        height: 300,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        mx: 'auto',
        my: 1,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 50% 20%, rgba(255,255,255,0.3), transparent 70%),
            linear-gradient(to bottom, #4a90e2, #2a65a0)
          `,
          filter: 'blur(4px)',
          zIndex: 0,
        }}
      />
      {[...Array(6)].map((_, i) => (
        <Bubble
          key={i}
          delay={i * 1.5}
          left={Math.random() * 100}
          size={6 + Math.random() * 10}
        />
      ))}
      <motion.div
        animate={{
          x: [30, 250, 30],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          repeatType: 'reverse'
        }}
        style={{
          position: 'absolute',
          top: '30%',
          left: '0%',
          transform: 'translateY(-50%)',
        }}
      >
        {fishImgUrl && fishImgUrl !== "" && (
          <Image
            src={fishImgUrl} 
            alt="fish"
            width={200}
            height={140}
          />
        )}
      </motion.div>
    </Box>
  )
}