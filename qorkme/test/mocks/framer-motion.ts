import React from 'react';

const motionPropKeys = new Set([
  'initial',
  'animate',
  'exit',
  'variants',
  'transition',
  'whileHover',
  'whileTap',
  'whileInView',
  'whileFocus',
  'whileDrag',
  'layout',
  'layoutId',
  'onAnimationStart',
  'onAnimationComplete',
  'viewport',
]);

const createMotionComponent = (tag: string) => {
  const Component = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
    const htmlProps: Record<string, unknown> = {};
    for (const key in props) {
      if (!motionPropKeys.has(key)) htmlProps[key] = props[key];
    }
    return React.createElement(tag, { ...htmlProps, ref });
  });
  Component.displayName = `motion.${tag}`;
  return Component;
};

export const motion = new Proxy({} as Record<string, React.ComponentType>, {
  get: (_target, prop: string) => createMotionComponent(prop),
});

export const useInView = () => true;
export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;
export type Variants = Record<string, unknown>;

/** Minimal MotionValue stub for useScroll/useTransform consumers. */
class MockMotionValue<T = number> {
  private listeners = new Set<(v: T) => void>();
  constructor(private value: T) {}
  get = () => this.value;
  set = (v: T) => {
    this.value = v;
    this.listeners.forEach((l) => l(v));
  };
  on = (_event: string, cb: (v: T) => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };
  destroy = () => this.listeners.clear();
}

export const useMotionValue = <T>(initial: T) => new MockMotionValue(initial);
export const useScroll = () => ({
  scrollX: new MockMotionValue(0),
  scrollY: new MockMotionValue(0),
  scrollXProgress: new MockMotionValue(0),
  scrollYProgress: new MockMotionValue(0),
});
export const useTransform = () => new MockMotionValue(0);
export const useSpring = (v: unknown) =>
  v instanceof MockMotionValue ? v : new MockMotionValue(v as number);
export const useMotionValueEvent = () => {};
export const useReducedMotion = () => false;
