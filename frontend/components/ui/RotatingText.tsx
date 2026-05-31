'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const VARIANTS = {
  enter:  { opacity: 0, y: 14, filter: 'blur(4px)' },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.32, ease: EASE },
  },
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

export default function RotatingText({
  words,
  interval = 2200,
  className = '',
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [words.length, interval]);

  // Reserve space based on the longest word so layout never shifts.
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <span className="relative inline-block" style={{ willChange: 'contents' }}>
      <style>{`
        @keyframes inline-metallic-shimmer {
          0%   { background-position: 250% center; }
          45%  { background-position: 50% center; }
          55%  { background-position: 0% center; }
          100% { background-position: -150% center; }
        }
        .metallic-silver-shimmer {
          background: linear-gradient(
            90deg,
            #ffffff 0%,
            #eef4f9 6%,
            #dde8f2 13%,
            #c8d6e4 20%,
            #b0bfcf 27%,
            #9daab8 33%,
            #8b9ab0 38%,
            #7a8a9e 42%,
            #687687 46%,
            #5c6d82 50%,
            #687687 54%,
            #7a8a9e 60%,
            #8b9ab0 67%,
            #9daab8 74%,
            #b0bfcf 80%,
            #c8d6e4 86%,
            #dde8f2 92%,
            #ffffff 100%
          ) !important;
          background-size: 350% auto !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          color: transparent !important;
          animation: inline-metallic-shimmer 4s ease-in-out infinite !important;
          display: inline-block !important;
          will-change: background-position !important;
          filter: drop-shadow(0 1px 10px rgba(180, 200, 220, 0.35)) !important;
        }
      `}</style>

      {/* Invisible spacer — keeps the parent line height stable */}
      <span className="invisible select-none" aria-hidden="true">
        {longestWord}
      </span>

      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={words[index]}
          variants={VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          className={`absolute left-0 top-0 whitespace-nowrap ${className}`}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
