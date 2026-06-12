'use client';

import { type ReactNode, type ElementType, useRef, useMemo, useCallback } from 'react';
import { usePretextContext } from './PretextProvider';
import { useContainerWidth } from './useContainerWidth';

type PretextBlockProps = {
  text: string;
  lineHeight: number;
  shrinkwrap?: boolean;
  className?: string;
  style?: React.CSSProperties;
  as?: ElementType;
  children: ReactNode;
};

/**
 * Drop-in wrapper that applies Pretext-driven min-height and optional
 * max-width (shrinkwrap) to its children. Reads font properties from
 * getComputedStyle() so it works with next/font rewritten names and
 * clamp()-based font sizes automatically.
 *
 * ONLY adds min-height and max-width — never touches font, color,
 * display, grid, flex, padding, or margin.
 */
export function PretextBlock({
  text,
  lineHeight,
  shrinkwrap = false,
  className,
  style,
  as: Tag = 'div',
  children,
}: PretextBlockProps) {
  const { isReady, prepare, layout } = usePretextContext();
  const [containerRef, width] = useContainerWidth(shrinkwrap);
  const elRef = useRef<HTMLElement | null>(null);
  const lastFontRef = useRef<string>('');
  const preparedRef = useRef<ReturnType<typeof prepare> | null>(null);

  const setRefs = useCallback(
    (node: HTMLElement | null) => {
      elRef.current = node;
      containerRef(node);
    },
    [containerRef]
  );

  // Compute layout adjustments
  const pretextStyle = useMemo(() => {
    if (!isReady || width <= 0 || !elRef.current) return undefined;

    const el = elRef.current;
    const cs = getComputedStyle(el);
    const fontSize = cs.fontSize;
    const fontWeight = cs.fontWeight;
    const fontFamily = cs.fontFamily;

    const fontShorthand = `${fontWeight} ${fontSize} ${fontFamily}`;

    // Only re-prepare when font actually changes
    if (fontShorthand !== lastFontRef.current || !preparedRef.current) {
      lastFontRef.current = fontShorthand;
      preparedRef.current = prepare(text, fontShorthand);
    }

    const prepared = preparedRef.current;
    const result = layout(prepared, width, lineHeight * parseFloat(fontSize));
    const adjustments: React.CSSProperties = {
      minHeight: `${result.height}px`,
    };

    if (shrinkwrap && result.lineCount > 0) {
      // Binary search for tightest width keeping same line count
      const targetLines = result.lineCount;
      let lo = 1;
      let hi = Math.ceil(width);
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (layout(prepared, mid, lineHeight * parseFloat(fontSize)).lineCount <= targetLines) {
          hi = mid;
        } else {
          lo = mid + 1;
        }
      }
      adjustments.maxWidth = `${lo}px`;
    }

    return adjustments;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, width, text, lineHeight, shrinkwrap, prepare, layout]);

  const mergedStyle = pretextStyle ? { ...style, ...pretextStyle } : style;

  return (
    <Tag ref={setRefs} className={className} style={mergedStyle}>
      {children}
    </Tag>
  );
}
