'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface RotatingTextProps {
  words: string[];
  interval?: number;
  className?: string;
}

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

  // Find the longest word to set the minimum width using invisible text.
  const longestWord = words.reduce((a, b) => (a.length > b.length ? a : b), '');

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="invisible" aria-hidden="true">
        {longestWord}
      </span>
      <AnimatePresence>
        <motion.span
          key={words[index]}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute left-0 top-0 whitespace-nowrap"
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}


