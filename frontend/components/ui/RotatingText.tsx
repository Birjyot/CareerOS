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
    <span className={`relative inline-block ${className}`} style={{ willChange: 'contents' }}>
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
          className="absolute left-0 top-0 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
