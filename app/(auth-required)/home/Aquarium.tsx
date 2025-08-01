'use client';

import { Box } from "@mui/material";
import { motion, useAnimation } from 'framer-motion';
import Image from "next/image";
import { Bubble } from "./Bubble";
import { useEffect } from "react";

export const Aquarium = ({ fishImgUrl }: { fishImgUrl: string | null }) => {
  const controls = useAnimation();

  useEffect(() => {
    const loopAnimation = async () => {
      while (true) {
        await controls.start({
          scaleX: -1,
          transition: {duration: 0.1}
        })
        await controls.start({
          x: 250,
          transition: { duration: 5, ease: "easeInOut" },
        });
        await controls.start({
          scaleX: 1,
          transition: {duration: 0.1}
        })
        await controls.start({
          x: 30,
          transition: { duration: 5, ease: "easeInOut" },
        });
      }
    };

    loopAnimation();
  }, [controls]);

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
      {/* 背景 */}
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

      {/* 泡 */}
      {[...Array(6)].map((_, i) => (
        <Bubble
          key={i}
          delay={i * 1.5}
          left={Math.random() * 100}
          size={6 + Math.random() * 10}
        />
      ))}

      {/* 魚 */}
      <motion.div
        animate={controls}
        style={{
          position: 'absolute',
          top: '30%',
          left: 0,
          transformOrigin: 'center',
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
  );
};
