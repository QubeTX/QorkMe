/**
 * ScrollTrace geometry — pure module, unit-tested.
 *
 * One continuous PCB-style circuit trace descending the left gutter with
 * 45° jogs, passing through a small isometric cube wireframe (the logo
 * motif) at each section boundary. Drawn forward on scroll down, reversed
 * on scroll up (the timeline is seek()ed, never triggered).
 */

export type TraceCube = {
  /** SVG path d-strings: hexagon outline + the three internal cube edges. */
  paths: string[];
  /** 0..1 fraction of the trace's vertical span where this cube sits. */
  at: number;
};

export type TraceGeometry = {
  /** The main circuit path. */
  d: string;
  cubes: TraceCube[];
  /** Total path length approximation (px) for duration weighting. */
  length: number;
};

const fmt = (n: number) => +n.toFixed(1);

/** Isometric cube wireframe centered at (cx, cy) with circumradius r. */
export function cubePaths(cx: number, cy: number, r: number): string[] {
  const w = r * 0.866; // cos(30°)
  const h = r * 0.5;
  const v = [
    [cx, cy - r], // 0 top
    [cx + w, cy - h], // 1 upper-right
    [cx + w, cy + h], // 2 lower-right
    [cx, cy + r], // 3 bottom
    [cx - w, cy + h], // 4 lower-left
    [cx - w, cy - h], // 5 upper-left
  ].map(([x, y]) => `${fmt(x)} ${fmt(y)}`);

  const hexagon = `M ${v[0]} L ${v[1]} L ${v[2]} L ${v[3]} L ${v[4]} L ${v[5]} Z`;
  const center = `${fmt(cx)} ${fmt(cy)}`;
  return [hexagon, `M ${center} L ${v[0]}`, `M ${center} L ${v[2]}`, `M ${center} L ${v[4]}`];
}

export type TraceOptions = {
  /** Y offsets (document px) where cube junctions sit (section boundaries). */
  junctions: number[];
  /** Trace starts/ends at these document offsets. */
  startY: number;
  endY: number;
  /** Horizontal center of the gutter lane. */
  gutterX: number;
  /** Jog amplitude (px each side of the lane). */
  amplitude?: number;
  /** Cube circumradius. */
  cubeR?: number;
};

export function buildTrace({
  junctions,
  startY,
  endY,
  gutterX,
  amplitude = 14,
  cubeR = 9,
}: TraceOptions): TraceGeometry {
  const span = endY - startY;
  if (span <= 0) return { d: '', cubes: [], length: 0 };

  const sorted = [...junctions].filter((y) => y > startY && y < endY).sort((a, b) => a - b);

  let x = gutterX - amplitude;
  let y = startY;
  let d = `M ${fmt(x)} ${fmt(y)}`;
  let length = 0;
  const cubes: TraceCube[] = [];

  for (const jy of sorted) {
    const targetX = x < gutterX ? gutterX + amplitude : gutterX - amplitude;
    const dx = Math.abs(targetX - x);
    // vertical run down to the 45° jog that lands exactly at the junction
    const jogStartY = jy - dx;
    if (jogStartY > y) {
      d += ` L ${fmt(x)} ${fmt(jogStartY)}`;
      length += jogStartY - y;
      y = jogStartY;
    }
    d += ` L ${fmt(targetX)} ${fmt(jy)}`;
    length += Math.hypot(dx, jy - y);
    x = targetX;
    y = jy;
    cubes.push({
      paths: cubePaths(x, y, cubeR),
      at: (jy - startY) / span,
    });
  }

  if (endY > y) {
    d += ` L ${fmt(x)} ${fmt(endY)}`;
    length += endY - y;
  }

  return { d, cubes, length };
}
