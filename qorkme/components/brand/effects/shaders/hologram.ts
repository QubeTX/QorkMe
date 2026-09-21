/** Adapted from verified vgpu Holographic Card, MIT (c) 2025 Vercel, Inc.
 * Source: vgpu Holographic Card. See docs/THIRD_PARTY_NOTICES.md.
 * Retains diffraction, pearlescence and glint. QorkMe color, font mask and linked-ring engraving replace the demo card graphics. */
export const shader = `
struct Params {
  resolution: vec2f,
  center: vec2f,
  tilt: vec2f,
  pointer: vec2f,
  hover: f32,
}
@group(0) @binding(0) var<uniform> params: Params;
fn roundedBox(p: vec2f, halfSize: vec2f, radius: f32) -> f32 {
  let q = abs(p) - halfSize + radius;
  return length(max(q, vec2f(0))) + min(max(q.x, q.y), 0.0) - radius;
}

fn stroke(distance: f32, width: f32, aa: f32) -> f32 {
  return 1.0 - smoothstep(width, width + aa, abs(distance));
}

// Approximate visible wavelengths in micrometers with smooth display RGB responses.
fn wavelengthColor(wavelength: f32) -> vec3f {
  let response = (vec3f(wavelength) - vec3f(0.610, 0.545, 0.460)) / vec3f(0.045, 0.038, 0.032);
  let visible = smoothstep(0.380, 0.410, wavelength) * (1.0 - smoothstep(0.700, 0.780, wavelength));
  return exp(-0.5 * response * response) * visible;
}

// Reflection grating approximation: m * wavelength = d * dot(L + V, across).
// L and V point away from the surface; across is perpendicular to the grooves.
// Based on the diffraction-order model in GPU Gems, chapter 8 (Jos Stam).
fn diffraction(across: vec2f, lightAndView: vec2f, spacing: f32) -> vec3f {
  let pathDifference = spacing * abs(dot(lightAndView, across));
  let along = dot(lightAndView, vec2f(-across.y, across.x));
  // Finite, imperfect groove patches broaden the directional reflection.
  let envelope = exp(-along * along / 0.36);
  var reflected = vec3f(0);
  for (var order = 1; order <= 3; order++) {
    let m = f32(order);
    reflected += wavelengthColor(pathDifference / m) / (m * m);
  }
  return reflected * envelope;
}

// Broad, art-directed pearlescence underneath the finer diffraction detail.
fn pearlColor(phase: f32) -> vec3f {
  return vec3f(0.55, 0.52, 0.64) + vec3f(0.43, 0.40, 0.34)
    * cos(6.2831853 * (phase + vec3f(0.05, 0.38, 0.63)));
}

fn grain(point: vec2f) -> f32 {
  let p = vec2u(abs(point) * 2400.0);
  var n = (p.x * 1597334677u) ^ (p.y * 3812015801u);
  n = (n ^ (n >> 16u)) * 2246822519u;
  return f32(n & 1023u) / 1023.0 - 0.5;
}

fn etchedPhase(p: vec2f) -> f32 {
  // Warp the surface before tracing contours, so their spacing flows in soft waves.
  let warp = vec2f(
    sin(p.y * 7.0 + sin(p.x * 4.0)) * 0.085,
    sin(p.x * 6.0 - p.y * 3.0) * 0.07
  );
  let q = p + warp;
  let radius = length(q * vec2f(1.0, 0.76));
  return radius * 142.0 + sin(atan2(q.y, q.x) * 3.0 + radius * 8.0) * 1.7;
}

// Two interlocking capsule outlines: a vector link mark etched into the foil.
// No bitmap, texture request or demo triangle remains.
fn linkEngraving(p: vec2f, aa: f32) -> f32 {
  let q = vec2f(p.x + p.y, -p.x + p.y) * 0.70710678;
  let upper = roundedBox(q - vec2f(0.0, -0.145), vec2f(0.12, 0.225), 0.115);
  let lower = roundedBox(q - vec2f(0.0, 0.145), vec2f(0.12, 0.225), 0.115);
  // A tiny break at each crossing makes the rings read as interlocked.
  let upperGap = smoothstep(0.024, 0.046, length(q - vec2f(0.105, 0.0)));
  let lowerGap = smoothstep(0.024, 0.046, length(q - vec2f(-0.105, 0.0)));
  let a = stroke(abs(upper) - 0.012, 0.002, aa * 0.7) * upperGap;
  let b = stroke(abs(lower) - 0.012, 0.002, aa * 0.7) * lowerGap;
  return max(a, b);
}

@fragment
fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let resolution = max(params.resolution, vec2f(1));
  let scale = resolution.y * (2.5 / 1.4);
  let screen = (uv - params.center) * resolution / scale * 2.5;
  let sx = sin(params.tilt.y);
  let cx = cos(params.tilt.y);
  let sy = sin(params.tilt.x);
  let cy = cos(params.tilt.x);
  let right = vec3f(cy, 0, -sy);
  let down = vec3f(sy * sx, cx, cy * sx);
  let normal = cross(right, down);
  let eye = vec3f(0, 0, 4.5);
  let ray = normalize(vec3f(screen, -4.5));
  let hit = eye - ray * (dot(eye, normal) / dot(ray, normal));
  let p = vec2f(dot(hit, right), dot(hit, down));
  let aa = max(length(fwidth(p)), 0.0006);
  // QorkMe blue-violet replaces graphite; grazing light reveals the original foil.
  let hover = clamp(params.hover, 0.0, 1.0);
  let lightCenter = params.pointer * vec2f(0.64, 0.91);
  let delta = p - lightCenter;
  let sweepDistance = delta.x * 0.72 + delta.y * 0.52 + sin(p.y * 4.0 + p.x * 3.0) * 0.08;
  let bandDistance = sweepDistance / 0.36;
  let lightBand = exp(-bandDistance * bandDistance);
  let glintDistance = sweepDistance / 0.085;
  let glint = exp(-glintDistance * glintDistance);
  let spotlight = exp(-dot(delta * vec2f(1.05, 0.72), delta * vec2f(1.05, 0.72)) * 2.6);
  let light = lightBand * spotlight * hover;
  let lightDirection = normalize(vec3f(lightCenter, 1.2) - hit);
  let viewDirection = normalize(eye - hit);
  let lightAndView = vec2f(dot(lightDirection + viewDirection, right), dot(lightDirection + viewDirection, down));
  let illumination = max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
  let tint = vec3f(0.72, 0.76, 0.8);
  let noise = grain(p + vec2f(2));
  var color = mix(vec3f(0.09, 0.353, 0.984), vec3f(0.439, 0.192, 0.929), smoothstep(0.0, 1.0, uv.x)) + 0.008 * (0.9 - p.y);
  // Fine, surface-locked grain catches the grazing reflection without animated static.
  color += noise * (0.022 + light * 0.085);
  color += light * (vec3f(0.045) + tint * 0.065);

  let contour = etchedPhase(p);
  // Transform screen derivatives back into the card plane: microscopic grooves
  // follow the visible contours, but their 1.65um spacing is independent of zoom.
  let dx = dpdx(p);
  let dy = dpdy(p);
  let gradient = vec2f(dpdx(contour) * dy.y - dpdy(contour) * dx.y, dpdy(contour) * dx.x - dpdx(contour) * dy.x);
  let across = gradient / max(length(gradient), 0.00000001);
  let outerDiffraction = diffraction(across, lightAndView, 1.65) * illumination;
  let contours = stroke(sin(contour), 0.06, min(fwidth(contour), 1.0));
  let reveal = hover * (0.06 + 0.24 * spotlight + light * 1.15);
  let pearlPhase = dot(lightAndView, vec2f(0.48, -0.32)) + p.y * 0.32 + contour * 0.003;
  let pearl = pearlColor(pearlPhase);
  color += pearl * light * 0.24;
  color += (pearl * 0.5 + vec3f(0.5)) * glint * spotlight * hover * 0.12;
  let sparkle = pow(max(noise + 0.5, 0.0), 24.0) * glint * spotlight * hover;
  color += pearl * sparkle * 0.22;
  let foil = vec3f(0.12, 0.14, 0.18) + pearl * 0.65 + outerDiffraction * 0.12;
  let link = linkEngraving(p, aa);
  // Continuous wave engraving; the link only emerges as the light crosses it.
  color += (contours * 0.48 + link * 0.72) * foil * reveal;
  let foilPoint = p - vec2f(0.007, -0.004) - params.tilt * 0.012;
  let foilPhase = etchedPhase(foilPoint);
  let foilLines = stroke(sin(foilPhase), 0.025, min(fwidth(foilPhase), 1.0));
  color += (foilLines * 0.48 + linkEngraving(foilPoint, aa) * 0.6) * (pearl + outerDiffraction * 0.2) * reveal * 0.22;
  let grid = (fract((p + 1.0) * 20.0) - 0.5) / 20.0;
  color += stroke(length(grid), 0.0008, aa * 0.4) * reveal * 0.1;

  // Makira glyph clipping is supplied by the existing, font-derived CSS mask.
  return vec4f(color, 1);
}
`;
