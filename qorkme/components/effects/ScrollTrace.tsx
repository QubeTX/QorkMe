'use client';

import { useEffect, useRef, useState } from 'react';
import { useLenis } from 'lenis/react';
import { createTimeline, svg as animeSvg, utils } from '@/lib/motion/anime';
import { buildTrace, type TraceGeometry } from '@/lib/motion/scrollTracePath';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { subscribe as subscribeResize } from '@/lib/pretext/resizeCoordinator';

/**
 * Scroll-scrubbed circuit trace: draws down the left gutter as you scroll,
 * REVERSES as you scroll up. A paused anime.js timeline of svg.createDrawable
 * segments is seek()ed from Lenis's smoothed progress — same-frame sync with
 * what the eye sees, and bidirectional for free. (anime's own onScroll is
 * deliberately not used: two rAF consumers double-smooth, and its internals
 * are unverified against the codebase's no-ResizeObserver law.)
 *
 * Layer: absolute full-document SVG behind content; junction cubes echo the
 * logo. Hidden <1024px (the gutter is too thin to matter). Reduced motion:
 * the complete trace renders statically at low opacity.
 *
 * Kit note: this is an OPTIONAL expressive decoration, not a mandatory
 * layer — reserve it for showcase surfaces, and let the specific design
 * (path, junctions, gutter — left OR right side, per the surface's layout)
 * vary per surface. Pass `sectionIds` to place the junction cubes at your
 * own section boundaries; `buildTrace`'s gutterX is just a lane coordinate.
 */

const SECTION_IDS = ['services', 'products', 'technologies', 'about', 'work', 'contact'];
const TL_DURATION = 1000;

type ScrollTraceProps = {
  /** Element ids whose top edges get junction cubes (defaults to the qubetx.com sections). */
  sectionIds?: string[];
};

export default function ScrollTrace({ sectionIds = SECTION_IDS }: ScrollTraceProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tlRef = useRef<ReturnType<typeof createTimeline> | null>(null);
  const [geo, setGeo] = useState<(TraceGeometry & { height: number }) | null>(null);
  const lenis = useLenis();
  // Value-keyed dep: an inline `sectionIds` literal must not re-measure per render
  const idsKey = sectionIds.join(' ');

  // Measure sections → build geometry (initial, on resize, after fonts settle)
  useEffect(() => {
    const measure = () => {
      if (window.innerWidth < 1024) {
        setGeo(null);
        return;
      }
      const docHeight = document.documentElement.scrollHeight;
      const offsets = sectionIds
        .map((id) => {
          const el = document.getElementById(id);
          return el ? el.getBoundingClientRect().top + window.scrollY : null;
        })
        .filter((v): v is number => v !== null);
      if (offsets.length === 0) return;

      const containerMax =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--container-max')
        ) || 1440;
      const wide = (window.innerWidth - containerMax) / 2;
      const gutterX = wide > 88 ? wide - 40 : 11;
      const tight = gutterX < 40;

      setGeo({
        ...buildTrace({
          junctions: offsets,
          startY: window.innerHeight * 0.75,
          endY: docHeight - 160,
          gutterX,
          amplitude: tight ? 5 : 14,
          cubeR: tight ? 5 : 9,
        }),
        height: docHeight,
      });
    };

    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
    const unsubscribe = subscribeResize(measure);
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  // Build the paused timeline whenever geometry changes
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl || !geo || !geo.d) return;

    const main = svgEl.querySelector<SVGPathElement>('[data-trace-main]');
    if (!main) return;
    const cubeGroups = Array.from(svgEl.querySelectorAll<SVGGElement>('[data-trace-cube]'));

    if (prefersReducedMotion()) {
      // Static complete trace
      utils.set([main, ...cubeGroups.flatMap((g) => Array.from(g.children))], {
        opacity: 0.6,
      });
      return;
    }

    const [mainDrawable] = animeSvg.createDrawable(main);
    const tl = createTimeline({ autoplay: false, defaults: { ease: 'linear' } });
    tl.add(mainDrawable, { draw: ['0 0', '0 1'], duration: TL_DURATION }, 0);
    for (const group of cubeGroups) {
      const at = Number(group.dataset.traceCube) * TL_DURATION;
      const edges = Array.from(group.querySelectorAll('path'));
      const drawables = edges.flatMap((edge) => animeSvg.createDrawable(edge));
      tl.add(drawables, { draw: ['0 0', '0 1'], duration: 40 }, Math.max(0, at - 20));
    }
    tlRef.current = tl;

    return () => {
      tl.pause();
      tlRef.current = null;
    };
  }, [geo]);

  // Scrub from Lenis (or native scroll as fallback)
  useLenis((instance) => {
    const tl = tlRef.current;
    if (tl) tl.seek(instance.progress * TL_DURATION);
  });

  useEffect(() => {
    if (lenis) return; // Lenis callback above is driving
    const onScroll = () => {
      const tl = tlRef.current;
      if (!tl) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      tl.seek((max > 0 ? window.scrollY / max : 0) * TL_DURATION);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lenis, geo]);

  if (!geo || !geo.d) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      width="100%"
      height={geo.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient
          id="trace-gradient"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
          gradientUnits="objectBoundingBox"
        >
          <stop offset="0" stopColor="#0066FF" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      {/* cheap glow pass — same d, wider stroke, no filters */}
      <path d={geo.d} fill="none" stroke="#2563eb" strokeWidth={5} opacity={0.06} />
      <path
        data-trace-main
        d={geo.d}
        fill="none"
        stroke="url(#trace-gradient)"
        strokeWidth={1.5}
        opacity={0.55}
      />
      {geo.cubes.map((cube, i) => (
        <g key={i} data-trace-cube={cube.at} opacity={0.7}>
          {cube.paths.map((d, j) => (
            <path key={j} d={d} fill="none" stroke="#2563eb" strokeWidth={1.2} />
          ))}
        </g>
      ))}
    </svg>
  );
}
