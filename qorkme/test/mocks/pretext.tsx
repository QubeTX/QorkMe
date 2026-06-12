import React from 'react';

export function PretextProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function PretextBlock({
  children,
  className,
  style,
  as: Tag = 'div',
}: {
  text: string;
  lineHeight: number;
  shrinkwrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
  children: React.ReactNode;
}) {
  return React.createElement(Tag, { className, style }, children);
}

export function usePretextContext() {
  return {
    isReady: false,
    prepare: () => ({}),
    layout: () => ({ height: 0, lineCount: 0 }),
  };
}

export function useContainerWidth() {
  return [() => {}, 0] as const;
}
