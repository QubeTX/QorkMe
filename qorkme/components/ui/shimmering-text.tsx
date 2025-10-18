'use client';

import type { CSSProperties } from 'react';
import { motion, useInView } from 'motion/react';
import { useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';

export interface ShimmeringTextProps {
  text: string;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  className?: string;
  startOnView?: boolean;
  once?: boolean;
  inViewMargin?: string;
  spread?: number;
  color?: string;
  shimmerColor?: string;
}

export function ShimmeringText({
  text,
  duration = 2,
  delay = 0,
  repeat = true,
  repeatDelay = 0.6,
  className,
  startOnView = true,
  once = false,
  inViewMargin,
  spread = 2,
  color,
  shimmerColor,
  ...rest
}: ShimmeringTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, {
    once,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    margin: (inViewMargin ?? '0px 0px -10%') as any,
  });

  const shouldAnimate = !startOnView || isInView;

  const style = useMemo(
    () =>
      ({
        '--shimmer-base': color ?? 'rgba(244, 237, 226, 0.4)',
        '--shimmer-highlight': shimmerColor ?? 'rgba(224, 139, 97, 0.95)',
        backgroundImage:
          'linear-gradient(90deg, var(--shimmer-base) 0%, var(--shimmer-highlight) 40%, var(--shimmer-base) 100%)',
        backgroundSize: `${Math.max(2, spread) * 100}% 100%`,
      }) as CSSProperties,
    [color, shimmerColor, spread]
  );

  const animation = useMemo(
    () =>
      shouldAnimate
        ? {
            backgroundPosition: ['-200% 50%', '200% 50%'],
            opacity: [0.4, 1],
          }
        : {
            backgroundPosition: '-200% 50%',
            opacity: 0,
          },
    [shouldAnimate]
  );

  return (
    <motion.span
      ref={ref}
      className={cn(
        'relative inline-block bg-clip-text text-transparent',
        'bg-[length:200%_100%] font-inter-heavy tracking-[0.08em]',
        className
      )}
      style={style}
      initial={{ backgroundPosition: '-200% 50%', opacity: 0 }}
      animate={animation}
      transition={{
        duration,
        ease: 'linear',
        delay,
        repeat: repeat ? Infinity : 0,
        repeatType: 'loop',
        repeatDelay,
      }}
      {...rest}
    >
      {text}
    </motion.span>
  );
}
