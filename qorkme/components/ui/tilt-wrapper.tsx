'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

interface TiltWrapperProps {
  children: React.ReactNode;
  className?: string;
  rotationFactor?: number; // Degrees of rotation at the extremes; higher values tilt more
  perspective?: number;
}

export function TiltWrapper({
  children,
  className,
  rotationFactor = 20,
  perspective = 1000,
}: TiltWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Mouse position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20, mass: 1 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20, mass: 1 });

  // Calculate rotation based on mouse position relative to center
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [rotationFactor, -rotationFactor]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-rotationFactor, rotationFactor]);

  // Glare effect opacity based on tilt intensity
  const glareOpacity = useTransform(
    [mouseXSpring, mouseYSpring],
    ([latestX, latestY]: number[]) => {
      const dist = Math.sqrt(latestX ** 2 + latestY ** 2);
      const maxGlareOpacity = 0.18;
      return Math.min(dist * maxGlareOpacity, maxGlareOpacity);
    }
  );

  // Glare gradient position moves opposite to mouse
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize to -0.5 to 0.5
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn('relative preserve-3d', className)}
      style={{
        perspective,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {children}

        {/* Dynamic Glare Overlay */}
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-50 mix-blend-soft-light"
          style={{
            opacity: glareOpacity,
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
