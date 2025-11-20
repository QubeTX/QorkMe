'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function AmbientDecor() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Large Terracotta Orb - Top Left */}
      <motion.div
        className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-primary)] opacity-[0.03] blur-[120px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Sage Orb - Bottom Right */}
      <motion.div
        className="absolute -bottom-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent)] opacity-[0.04] blur-[100px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Floating Particles */}
      <Particle
        className="top-[20%] left-[15%] w-3 h-3 bg-[var(--color-primary)] opacity-20"
        duration={15}
        delay={0}
      />
      <Particle
        className="top-[60%] right-[20%] w-2 h-2 bg-[var(--color-accent)] opacity-20"
        duration={18}
        delay={5}
      />
      <Particle
        className="bottom-[30%] left-[10%] w-4 h-4 bg-[var(--color-text-muted)] opacity-10"
        duration={22}
        delay={2}
      />
    </div>
  );
}

function Particle({
  className,
  duration,
  delay,
}: {
  className: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full ${className}`}
      animate={{
        y: [0, -100, 0],
        opacity: [0.1, 0.3, 0.1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  );
}
