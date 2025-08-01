'use client';

import { Box } from "@mui/material";
import { motion } from 'framer-motion';
import Image from "next/image";

export const Aquarium = ({fishImgUrl} : {fishImgUrl: string | null}) => {
  return (
    <Box
      sx={{
        width: 500,
        height: 300,
        background: 'linear-gradient(to bottom, #b3e5fc, #81d4fa)',
        borderRadius: 4,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        border: '4px solid #0288d1',
        position: 'relative',
        mx: 'auto',
        my: 1,
      }}
    >
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
          top: '35%',
          left: '0%',
          transform: 'translateY(-50%)',
        }}
      >
        {fishImgUrl && fishImgUrl !== "" && (
          <Image
            src={fishImgUrl} 
            alt="fish"
            width={120}
            height={80}
          />
        )}
      </motion.div>
    </Box>
  )
}