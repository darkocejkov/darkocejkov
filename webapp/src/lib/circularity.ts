/**
 * Concentric ring geometry, ported from https://github.com/darkocejkov/circularity
 *
 * Ring k has inscribed radius  pupil + spacing * (1 + g + g^2 + ... + g^(k-1))
 * and stroke width             stroke * taper^k.
 *
 * Morph progress and wave amplitude ramp with u = k / (count - 1), so ring 0 is
 * always the clean centre shape. Ring 0 IS the pupil — callers fill it rather
 * than stroking it.
 *
 * Only the first four parameters are in use today. The rest are wired with
 * neutral defaults so enabling distortion later is passing a number, not a
 * rewrite. Under the defaults no ring ever needs sampling, so `d` stays
 * undefined and consumers render <circle> throughout.
 */

const TAU = Math.PI * 2;
const rad = (deg: number) => (deg * Math.PI) / 180;

export interface RingParams {
  /** Radius of the filled centre disc (ring 0). */
  pupil: number;
  /** Gap between consecutive rings. */
  spacing: number;
  /** Ring count, pupil included. Fractional values fade the outermost ring in. */
  count: number;
  /** Base stroke width. */
  stroke: number;

  // --- Dormant. Defaults reproduce plain, evenly spaced circles. ---
  /** Geometric growth applied to spacing. 1 = even spacing. */
  spacingGrowth?: number;
  /** Geometric taper applied to stroke width. 1 = uniform. */
  taper?: number;
  /** Sides of the centre shape. 0 = circle. */
  centerSides?: number;
  /** Sides of the outermost shape. 0 = circle. */
  outerSides?: number;
  /** Exponent on the centre-to-outer morph ramp. */
  morphCurve?: number;
  /** Peak wave amplitude at the outermost ring. 0 = no wave. */
  amplitude?: number;
  /** Wave lobes around the circumference. */
  lobes?: number;
  /** Exponent on the wave amplitude ramp. */
  waveRamp?: number;
  /** Per-ring wave phase shift, in degrees. */
  twist?: number;
  /** Shape rotation, in degrees. */
  rotation?: number;
  /**
   * How much of a ring index a newly arrived ring takes to reach full
   * opacity. 1 spreads the fade across the whole step; smaller values bring
   * it up sooner, so rings arrive crisply instead of drifting in.
   */
  birthFade?: number;
  /** Points sampled per ring when a path is required. */
  samples?: number;
}

export interface Ring {
  /** 0-based index. Ring 0 is the pupil. */
  k: number;
  /** Inscribed radius. */
  r: number;
  /** Stroke width. Independent of opacity, so an arriving ring is never thin. */
  strokeWidth: number;
  /** 1 for a fully arrived ring; ramping up for one that has only partly arrived. */
  opacity: number;
  /** Origin-centred path data. Present only when the ring is morphed or wavy. */
  d?: string;
}

/** Angle of a polygon's first vertex: odd polygons point up, even rest on a flat edge. */
function firstVertex(sides: number, rot: number): number {
  return -Math.PI / 2 + (sides % 2 === 0 ? Math.PI / sides : 0) + rot;
}

/**
 * Polar radius at angle theta of a regular polygon whose inscribed circle has
 * radius `a`. A circle (sides 0) is just `a`.
 */
function shapeRadius(sides: number, a: number, theta: number, rot: number): number {
  if (sides === 0) return a;
  const step = TAU / sides;
  const psi = theta - firstVertex(sides, rot) - step / 2;
  const m = ((psi % step) + step) % step;
  return a / Math.cos(Math.min(m, step - m));
}

/** Origin-centred outline for a ring that cannot be expressed as a plain circle. */
function samplePath(
  r: number,
  morph: number,
  amp: number,
  phase: number,
  centerSides: number,
  outerSides: number,
  lobes: number,
  rot: number,
  samples: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < samples; i++) {
    const th = (i / samples) * TAU;
    const inner = shapeRadius(centerSides, r, th, rot);
    const outer = shapeRadius(outerSides, r, th, rot);
    const rr = inner + (outer - inner) * morph + amp * Math.sin(lobes * th + phase);
    pts.push(`${(rr * Math.cos(th)).toFixed(2)} ${(rr * Math.sin(th)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}

export function ringGeometry(p: RingParams): Ring[] {
  const {
    pupil,
    spacing,
    count,
    stroke,
    spacingGrowth = 1,
    taper = 1,
    centerSides = 0,
    outerSides = 0,
    morphCurve = 1,
    amplitude = 0,
    lobes = 6,
    waveRamp = 1,
    twist = 0,
    rotation = 0,
    birthFade = 1,
    samples = 240,
  } = p;

  const evenlySpaced = Math.abs(spacingGrowth - 1) < 1e-9;
  const rot = rad(rotation);
  const phaseStep = rad(twist);

  // A fractional count still emits its partial outermost ring.
  const total = Math.max(0, Math.ceil(count - 1e-9));

  // Circularity normalises the ramp against count - 1. A fractional count could
  // push the outermost ring past u = 1, so clamp it.
  const denom = Math.max(1, Math.ceil(count) - 1);

  const rings: Ring[] = [];

  for (let k = 0; k < total; k++) {
    const r = evenlySpaced
      ? pupil + spacing * k
      : pupil + (spacing * (Math.pow(spacingGrowth, k) - 1)) / (spacingGrowth - 1);

    // A fractional count means the outermost ring has only partly arrived.
    // It comes up in opacity alone — width is left at full, so the stroke
    // never appears to thin as the ring materialises.
    const remainder = count - k;
    const opacity = Math.min(1, Math.max(0, remainder / birthFade));
    const strokeWidth = stroke * Math.pow(taper, k);

    const u = Math.min(1, k / denom);
    const morph = Math.pow(u, morphCurve);
    const amp = amplitude * Math.pow(u, waveRamp);

    const ring: Ring = { k, r, strokeWidth, opacity };

    // Exactly reproducible as a circle? Then skip sampling entirely.
    const exact =
      centerSides === outerSides ? centerSides : morph === 0 ? centerSides : morph === 1 ? outerSides : -1;

    if (!(amp === 0 && exact === 0)) {
      ring.d = samplePath(r, morph, amp, phaseStep * k, centerSides, outerSides, lobes, rot, samples);
    }

    rings.push(ring);
  }

  return rings;
}
