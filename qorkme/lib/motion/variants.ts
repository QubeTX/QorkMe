import type { Variants } from 'framer-motion';

/** Shared Framer Motion variants (migrated from src/utils/animations.ts). */

export function createContainerVariants(
  staggerDelay: number = 0.15,
  delayChildren: number = 0
): Variants {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        ...(delayChildren > 0 && { delayChildren }),
      },
    },
  };
}

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 },
};

export const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 50,
    },
  },
};

export const sectionTitleAnimation = {
  initial: { opacity: 0, y: 20 } as const,
  transition: { duration: 0.6 } as const,
  getAnimate: (isInView: boolean) => (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }),
};
