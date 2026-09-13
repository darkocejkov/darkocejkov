# Eye Shell Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the site as one persistent scene — a cursor-tracking two-circle "eye" with five orbiting page nodes — driven by a port of the circularity ring generator.

**Architecture:** A pure geometry module (`src/lib/circularity.ts`) emits ring descriptors from parameters. Presentational React components render those descriptors as SVG. The scene mounts in the root layout, so Next.js App Router keeps it alive across route changes with no portals. Discrete state (route phase, active node) lives in zustand; per-frame values (pointer, parallax, orbit rotation) live in `motion` motion values so they never trigger a React render.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS 4, `motion` v12, `zustand` v5, `vitest` (added by Task 1). Content from Strapi via the existing `src/lib/strapi.ts`.

**Spec:** `docs/superpowers/specs/2026-09-13-eye-shell-redesign-design.md`

## Global Constraints

- All work happens inside `webapp/`. Run every command from `webapp/`.
- Branch is `redesign/eye-shell`. Do not commit to `main`.
- Brand palette, already defined in `globals.css`: navy `#011627`, white `#FDFFFC`, orange `#FF9F1C` (focus/active only), red `#F71735`, cyan `#41EAD4`.
- Import alias `@/*` maps to `./src/*`.
- TypeScript is `strict: true`. No `any`, no non-null assertions on values that can genuinely be null.
- **Ring indices are 0-based. `k = 0` IS the pupil** (the filled centre disc). `count: 2` therefore emits exactly two rings: the pupil at `k=0` and one stroked ring at `k=1`.
- Live parameters are `pupil`, `spacing`, `count`, `stroke` only. Every other generator parameter must default to a value that reproduces plain circles.
- Dark mode uses a `.dark` class on `<html>` and the existing `@custom-variant dark (&:where(.dark, .dark *))`. Components use `currentColor` so theming needs no per-component logic.
- Satellite navigation must be real `<Link>` elements. SVG is `aria-hidden="true"`. This is non-negotiable.
- Honour `prefers-reduced-motion` everywhere motion is introduced.
- Commit after every task. Use conventional-commit prefixes (`feat:`, `test:`, `chore:`, `refactor:`).
- End every commit message with:
  `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`

---

### Task 1: Test runner and the circularity generator

The foundation. Pure math, no React, no DOM — ideal for strict TDD.

**Files:**
- Create: `webapp/vitest.config.ts`
- Create: `webapp/src/lib/circularity.ts`
- Create: `webapp/src/lib/circularity.test.ts`
- Modify: `webapp/package.json` (add `vitest` devDependency and `test` scripts)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `ringGeometry(p: RingParams): Ring[]`
  - `interface RingParams { pupil: number; spacing: number; count: number; stroke: number; spacingGrowth?: number; taper?: number; centerSides?: number; outerSides?: number; morphCurve?: number; amplitude?: number; lobes?: number; waveRamp?: number; twist?: number; rotation?: number; samples?: number }`
  - `interface Ring { k: number; r: number; strokeWidth: number; opacity: number; d?: string }`

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Add test scripts to `package.json`**

In the `"scripts"` block, add these two entries alongside the existing `dev`/`build`/`start`/`lint`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Create `vitest.config.ts`**

The `@/` alias is defined in `tsconfig.json`, which vitest does not read. It must be repeated here or every import fails to resolve.

```ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  test: {
    // The generator is pure math — no DOM needed.
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Write the failing tests**

Create `webapp/src/lib/circularity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { ringGeometry } from "./circularity";

const base = { pupil: 46, spacing: 40, count: 2, stroke: 26 };

describe("ringGeometry", () => {
  it("emits the pupil at k=0 and one ring at k=1 for count 2", () => {
    const rings = ringGeometry(base);
    expect(rings.map((r) => r.k)).toEqual([0, 1]);
    expect(rings[0].r).toBe(46);
    expect(rings[1].r).toBe(86);
  });

  it("spaces rings linearly when spacingGrowth is 1", () => {
    const rings = ringGeometry({ ...base, count: 4, spacing: 10, pupil: 5 });
    expect(rings.map((r) => r.r)).toEqual([5, 15, 25, 35]);
  });

  it("compounds spacing geometrically when spacingGrowth is not 1", () => {
    const rings = ringGeometry({ ...base, count: 3, spacing: 10, pupil: 0, spacingGrowth: 2 });
    // r0 + spacing * (g^k - 1) / (g - 1)  ->  0, 10, 30
    expect(rings.map((r) => r.r)).toEqual([0, 10, 30]);
  });

  it("applies taper to stroke width per ring index", () => {
    const rings = ringGeometry({ ...base, count: 3, stroke: 8, taper: 0.5 });
    expect(rings.map((r) => r.strokeWidth)).toEqual([8, 4, 2]);
  });

  it("fades the outermost ring in when count is fractional", () => {
    const rings = ringGeometry({ ...base, count: 2.5 });
    expect(rings).toHaveLength(3);
    expect(rings[0].opacity).toBe(1);
    expect(rings[1].opacity).toBe(1);
    expect(rings[2].opacity).toBeCloseTo(0.5);
    // Stroke width scales with opacity so the ring thins in as it fades in.
    expect(rings[2].strokeWidth).toBeCloseTo(base.stroke * 0.5);
  });

  it("emits no path data under neutral parameters — circles, never paths", () => {
    const rings = ringGeometry({ ...base, count: 9 });
    expect(rings.every((r) => r.d === undefined)).toBe(true);
  });

  it("emits path data once a wave amplitude is set", () => {
    const rings = ringGeometry({ ...base, count: 4, amplitude: 5 });
    // k=0 has u=0 so its amplitude is still 0 and it stays a circle.
    expect(rings[0].d).toBeUndefined();
    expect(rings[3].d).toBeDefined();
    expect(rings[3].d!.startsWith("M")).toBe(true);
  });

  it("emits path data once the outer shape is a polygon", () => {
    const rings = ringGeometry({ ...base, count: 4, outerSides: 6 });
    expect(rings[3].d).toBeDefined();
  });

  it("returns only the pupil for count 1", () => {
    expect(ringGeometry({ ...base, count: 1 })).toHaveLength(1);
  });

  it("returns nothing for count 0", () => {
    expect(ringGeometry({ ...base, count: 0 })).toHaveLength(0);
  });
});
```

- [ ] **Step 5: Run the tests and verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./circularity"` or `ringGeometry is not a function`.

- [ ] **Step 6: Implement the generator**

Create `webapp/src/lib/circularity.ts`. The formulas are ported verbatim from circularity's `rings()` and `shapeRadius()`:

```ts
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
  /** Points sampled per ring when a path is required. */
  samples?: number;
}

export interface Ring {
  /** 0-based index. Ring 0 is the pupil. */
  k: number;
  /** Inscribed radius. */
  r: number;
  /** Stroke width, already scaled by a fractional ring's opacity. */
  strokeWidth: number;
  /** 1 for whole rings; the fractional remainder for a partial outermost ring. */
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

    const remainder = count - k;
    const opacity = remainder >= 1 ? 1 : Math.max(0, remainder);
    const strokeWidth = stroke * Math.pow(taper, k) * opacity;

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
```

- [ ] **Step 7: Run the tests and verify they pass**

Run: `npm test`
Expected: PASS — 10 passed.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts src/lib/circularity.ts src/lib/circularity.test.ts
git commit -m "$(cat <<'EOF'
feat: port the circularity ring generator

Pure geometry module emitting ring descriptors from parameters. Ring 0 is the
pupil. Fractional ring counts fade the outermost ring in by opacity and stroke
width, which is what makes count animatable.

The full circularity parameter set is present but defaults to values that
reproduce plain circles, so no ring is ever sampled to a path today.

Adds vitest as the test runner.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Orbit geometry and node configuration

More pure math: where satellites sit, which one is selected, and how far the pupil may travel.

**Files:**
- Create: `webapp/src/lib/orbit.ts`
- Create: `webapp/src/lib/orbit.test.ts`
- Create: `webapp/src/config/nodes.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `orbitPosition(index: number, total: number, radius: number, rotation?: number): { x: number; y: number; angle: number }`
  - `nearestNodeIndex(rotation: number, total: number, selectorAngle?: number): number`
  - `rotationForNode(index: number, total: number, selectorAngle?: number): number`
  - `maxPupilOffset(spacing: number, stroke: number): number`
  - `SELECTOR_ANGLE: number` (= `Math.PI`, the 9 o'clock rotary selector)
  - `NODES: ReadonlyArray<{ slug: string; href: string; label: string }>`

- [ ] **Step 1: Write the failing tests**

Create `webapp/src/lib/orbit.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  SELECTOR_ANGLE,
  maxPupilOffset,
  nearestNodeIndex,
  orbitPosition,
  rotationForNode,
} from "./orbit";

describe("orbitPosition", () => {
  it("places the first node at 12 o'clock", () => {
    const { x, y } = orbitPosition(0, 4, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-100);
  });

  it("distributes nodes evenly clockwise", () => {
    const { x, y } = orbitPosition(1, 4, 100);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(0);
  });

  it("offsets every node by the orbit rotation", () => {
    const { x, y } = orbitPosition(0, 4, 100, Math.PI / 2);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(0);
  });
});

describe("rotationForNode / nearestNodeIndex", () => {
  it("round-trips: the rotation that selects node i selects node i", () => {
    for (let i = 0; i < 5; i++) {
      expect(nearestNodeIndex(rotationForNode(i, 5), 5)).toBe(i);
    }
  });

  it("puts the chosen node at the 9 o'clock selector", () => {
    const { x, y } = orbitPosition(2, 5, 100, rotationForNode(2, 5));
    expect(x).toBeCloseTo(-100);
    expect(y).toBeCloseTo(0);
  });

  it("survives rotations wound past a full turn", () => {
    expect(nearestNodeIndex(rotationForNode(3, 5) + Math.PI * 4, 5)).toBe(3);
    expect(nearestNodeIndex(rotationForNode(3, 5) - Math.PI * 6, 5)).toBe(3);
  });

  it("defaults the selector to 9 o'clock", () => {
    expect(SELECTOR_ANGLE).toBeCloseTo(Math.PI);
  });
});

describe("maxPupilOffset", () => {
  it("keeps the pupil clear of the inner edge of its ring", () => {
    // Ring 1 sits at pupil + 40; a 26-wide stroke reaches 13 inward.
    expect(maxPupilOffset(40, 26)).toBe(27);
  });

  it("never returns a negative travel", () => {
    expect(maxPupilOffset(5, 40)).toBe(0);
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./orbit"`.

- [ ] **Step 3: Implement `src/lib/orbit.ts`**

```ts
/** Geometry for the satellite orbit and the pupil's travel limit. Pure. */

const TAU = Math.PI * 2;

/** The rotary selector sits at 9 o'clock, matching the mockup's left-hand highlight. */
export const SELECTOR_ANGLE = Math.PI;

/** Position of satellite `index` on an orbit of `radius`, relative to the eye's centre. */
export function orbitPosition(
  index: number,
  total: number,
  radius: number,
  rotation = 0,
): { x: number; y: number; angle: number } {
  // -PI/2 starts the ring at 12 o'clock; indices advance clockwise.
  const angle = -Math.PI / 2 + (index / total) * TAU + rotation;
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), angle };
}

/** Shortest signed distance between two angles, in -PI..PI. */
function angleDelta(a: number, b: number): number {
  return (((a - b + Math.PI) % TAU) + TAU) % TAU - Math.PI;
}

/** Which satellite currently sits closest to the selector. */
export function nearestNodeIndex(rotation: number, total: number, selectorAngle = SELECTOR_ANGLE): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < total; i++) {
    const { angle } = orbitPosition(i, total, 1, rotation);
    const dist = Math.abs(angleDelta(angle, selectorAngle));
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/** The orbit rotation that parks satellite `index` on the selector. */
export function rotationForNode(index: number, total: number, selectorAngle = SELECTOR_ANGLE): number {
  return selectorAngle + Math.PI / 2 - (index / total) * TAU;
}

/**
 * How far the pupil may travel before colliding with ring 1.
 *
 * Ring 1's inner edge is at `pupil + spacing - stroke / 2`, and the pupil's own
 * radius is `pupil`, so the clearance is `spacing - stroke / 2` regardless of
 * pupil size. Recompute whenever spacing or stroke animate.
 */
export function maxPupilOffset(spacing: number, stroke: number): number {
  return Math.max(0, spacing - stroke / 2);
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run: `npm test`
Expected: PASS — all orbit and circularity tests green.

- [ ] **Step 5: Create `src/config/nodes.ts`**

```ts
/**
 * The orbiting page nodes. Orbit positions derive from index and array length,
 * so adding a sixth node is one entry here and nothing else.
 */
export interface SceneNode {
  slug: string;
  href: string;
  label: string;
}

export const NODES: ReadonlyArray<SceneNode> = [
  { slug: "work", href: "/projects", label: "Work" },
  { slug: "blog", href: "/blog", label: "Blog" },
  { slug: "bookmarks", href: "/bookmarks", label: "Bookmarks" },
  { slug: "about", href: "/about", label: "About" },
  { slug: "things", href: "/things", label: "Things" },
];

/** Index of the node owning a pathname, or -1 on the homepage / an unknown route. */
export function nodeIndexForPath(pathname: string): number {
  return NODES.findIndex((n) => pathname === n.href || pathname.startsWith(`${n.href}/`));
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/orbit.ts src/lib/orbit.test.ts src/config/nodes.ts
git commit -m "$(cat <<'EOF'
feat: add orbit geometry and node configuration

Satellite positions, rotary snap targets and the pupil's travel bound, all as
pure functions. The five page nodes come from one array, so the orbit adapts to
its length.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: The Eye component

Turns ring descriptors into SVG. Purely presentational — no state, no listeners.

**Files:**
- Create: `webapp/src/components/eye/Eye.tsx`

**Interfaces:**
- Consumes: `ringGeometry`, `RingParams` from `@/lib/circularity`.
- Produces: default export `Eye`, with props
  `{ params: RingParams; size: number; pupilX?: MotionValue<number>; pupilY?: MotionValue<number>; className?: string }`.

- [ ] **Step 1: Create the component**

`currentColor` means the palette follows Tailwind text classes, so dark mode needs no code here.

```tsx
"use client";

import { motion, type MotionValue } from "motion/react";
import { ringGeometry, type RingParams } from "@/lib/circularity";

interface EyeProps {
  params: RingParams;
  /** viewBox edge length. The eye is centred within it. */
  size: number;
  /** Pupil parallax offset. Bound these with maxPupilOffset before passing them in. */
  pupilX?: MotionValue<number>;
  pupilY?: MotionValue<number>;
  className?: string;
}

/**
 * Renders ring descriptors as SVG. Ring 0 is filled (the pupil) and carries the
 * parallax offset; rings 1+ are stroked and stay put.
 *
 * Decorative only — aria-hidden. Navigation lives in Orbit as real links.
 */
export default function Eye({ params, size, pupilX, pupilY, className }: EyeProps) {
  const rings = ringGeometry(params);
  const centre = size / 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g transform={`translate(${centre} ${centre})`}>
        {rings.map((ring) => {
          if (ring.k === 0) {
            return (
              <motion.g key={ring.k} style={{ x: pupilX, y: pupilY }}>
                {ring.d ? (
                  <path d={ring.d} fill="currentColor" opacity={ring.opacity} />
                ) : (
                  <circle r={ring.r} fill="currentColor" opacity={ring.opacity} />
                )}
              </motion.g>
            );
          }
          return ring.d ? (
            <path
              key={ring.k}
              d={ring.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          ) : (
            <circle
              key={ring.k}
              r={ring.r}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          );
        })}
      </g>
    </svg>
  );
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/eye/Eye.tsx
git commit -m "$(cat <<'EOF'
feat: add the Eye component

Renders circularity ring descriptors as SVG. Ring 0 fills as the pupil and
carries the parallax offset; outer rings stroke. Uses currentColor so dark mode
needs no per-component handling.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Pointer tracking and parallax

Per-frame values live in motion values, never in React state.

**Files:**
- Create: `webapp/src/components/eye/usePointer.ts`

**Interfaces:**
- Consumes: nothing. (The travel bound is applied by Task 7, the caller — not here.)
- Produces: `usePointer(): { px: MotionValue<number>; py: MotionValue<number>; reduced: boolean }` where `px`/`py` are spring-smoothed and normalised to `-1 … 1`, and `useParallax(px, py, depth): { x: MotionValue<number>; y: MotionValue<number> }`.

- [ ] **Step 1: Create the hook**

```ts
"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Viewport-normalised pointer position, spring-smoothed.
 *
 * Deliberately NOT in the zustand store: these update at frame rate, and routing
 * them through React state would re-render the whole scene sixty times a second.
 * Motion values mutate the DOM directly instead.
 *
 * Returns zeroed, non-reactive values under prefers-reduced-motion.
 */
export function usePointer() {
  const reduced = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Softer spring than the default so the eye lags the cursor slightly — the lag
  // is what reads as depth.
  const px = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;

    function onMove(e: PointerEvent) {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    }

    // Recentre when the cursor leaves the window, so the eye doesn't stay
    // staring at the last known edge position.
    function onLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [rawX, rawY, reduced]);

  return { px, py, reduced };
}

/**
 * Scales normalised pointer values into pixel translation for one depth layer.
 * Larger `depth` = nearer the viewer = moves further.
 */
export function useParallax(
  px: MotionValue<number>,
  py: MotionValue<number>,
  depth: number,
): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  return { x, y };
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/eye/usePointer.ts
git commit -m "$(cat <<'EOF'
feat: add pointer tracking and parallax hooks

Pointer position lives in motion values rather than React state so the scene
never re-renders on mouse movement. Springs are tuned so outer layers lag the
pupil, which is what reads as depth. Disabled under prefers-reduced-motion.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: The scene store

Discrete state only.

**Files:**
- Create: `webapp/src/stores/scene.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `useSceneStore` with shape
  `{ phase: "home" | "docked"; activeNode: number; setPhase(p): void; setActiveNode(i): void }`.

- [ ] **Step 1: Create the store**

```ts
import { create } from "zustand";

export type ScenePhase = "home" | "docked";

interface SceneState {
  /** "home" centres the eye full-bleed; "docked" pins it to the rail. */
  phase: ScenePhase;
  /** Index into NODES, or -1 when nothing is selected. */
  activeNode: number;
  setPhase: (phase: ScenePhase) => void;
  setActiveNode: (index: number) => void;
}

/**
 * Discrete scene state only — things that change at human speed.
 *
 * Pointer position and orbit rotation are deliberately absent: they change every
 * frame and live in motion values instead. See usePointer.
 */
export const useSceneStore = create<SceneState>((set) => ({
  phase: "home",
  activeNode: -1,
  setPhase: (phase) => set({ phase }),
  setActiveNode: (activeNode) => set({ activeNode }),
}));
```

- [ ] **Step 2: Verify it typechecks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/stores/scene.ts
git commit -m "$(cat <<'EOF'
feat: add the scene store

Holds route phase and active node only. Per-frame values stay in motion values
so this store never causes a render storm.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: The Orbit component — accessible satellite navigation

**Files:**
- Create: `webapp/src/components/eye/Orbit.tsx`

**Interfaces:**
- Consumes: `NODES` from `@/config/nodes`; `orbitPosition` from `@/lib/orbit`; `useSceneStore` from `@/stores/scene`.
- Produces: default export `Orbit`, props
  `{ radius: number; dotSize: number; rotation?: MotionValue<number>; showLabels?: boolean }`.

- [ ] **Step 1: Create the component**

Satellites are real anchors. The visible dot is a styled `<span>`; the SVG is never the interactive element.

```tsx
"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { NODES } from "@/config/nodes";
import { orbitPosition } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

interface OrbitProps {
  /** Orbit radius in pixels. */
  radius: number;
  /** Diameter of an unselected satellite dot. */
  dotSize: number;
  /** Live orbit rotation in radians. Omit for a static orbit. */
  rotation?: MotionValue<number>;
  /** Render text labels beside the dots. */
  showLabels?: boolean;
}

function Satellite({
  index,
  radius,
  dotSize,
  rotation,
  showLabels,
}: OrbitProps & { index: number }) {
  const node = NODES[index];
  const activeNode = useSceneStore((s) => s.activeNode);
  const isActive = activeNode === index;

  // A stable zero value for the static (desktop) case, so the transforms below
  // are always given a real MotionValue — hooks cannot be called conditionally.
  const staticRotation = useMotionValue(0);
  const turn = rotation ?? staticRotation;

  // Recompute position as the orbit turns, without re-rendering React.
  const x = useTransform(turn, (r) => orbitPosition(index, NODES.length, radius, r).x);
  const y = useTransform(turn, (r) => orbitPosition(index, NODES.length, radius, r).y);

  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y }}>
      <Link
        href={node.href}
        aria-current={isActive ? "page" : undefined}
        className="group flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className={[
            "block rounded-full bg-current transition-transform duration-200",
            isActive ? "scale-125 ring-2 ring-brand-orange ring-offset-2" : "group-hover:scale-110",
          ].join(" ")}
          style={{ width: dotSize, height: dotSize }}
        />
        <span className={showLabels ? "text-sm" : "sr-only"}>{node.label}</span>
      </Link>
    </motion.div>
  );
}

export default function Orbit(props: OrbitProps) {
  return (
    <nav aria-label="Sections" className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto contents">
        {NODES.map((node, i) => (
          <Satellite key={node.slug} {...props} index={i} />
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Verify it typechecks and lints**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/eye/Orbit.tsx
git commit -m "$(cat <<'EOF'
feat: add the Orbit component

Satellites are real Link elements positioned at their orbit coordinates, so the
navigation is keyboard-reachable and announced. The dots are decorative spans;
labels stay in the accessibility tree even when visually hidden.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 7: The Scene shell — layout integration and removal of the old chrome

The pivot. After this task the eye is live and the old header and footer are gone.

**Files:**
- Create: `webapp/src/components/eye/Scene.tsx`
- Modify: `webapp/src/app/layout.tsx`
- Modify: `webapp/src/app/page.tsx` (becomes empty — Scene owns the homepage)
- Modify: `webapp/src/app/globals.css` (strip the squircle utility)
- Delete: `webapp/src/components/Header.tsx`
- Delete: `webapp/src/components/Footer.tsx`

**Interfaces:**
- Consumes: `Eye`, `Orbit`, `usePointer`, `useParallax`, `useSceneStore`, `nodeIndexForPath`, `maxPupilOffset`.
- Produces: default export `Scene`, props `{ children: React.ReactNode }`.

- [ ] **Step 1: Create `Scene.tsx`**

```tsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { motion, useTransform } from "motion/react";
import Eye from "./Eye";
import Orbit from "./Orbit";
import { useParallax, usePointer } from "./usePointer";
import { nodeIndexForPath } from "@/config/nodes";
import { maxPupilOffset } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Resting eye: pupil plus exactly one ring — the mockup. */
const HOME_EYE = { pupil: 46, spacing: 40, count: 2, stroke: 26 };

export default function Scene({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { px, py } = usePointer();
  const setPhase = useSceneStore((s) => s.setPhase);
  const setActiveNode = useSceneStore((s) => s.setActiveNode);
  const phase = useSceneStore((s) => s.phase);

  useEffect(() => {
    const home = pathname === "/";
    setPhase(home ? "home" : "docked");
    // On "/" the rotary owns activeNode. Writing here would run after the
    // rotary's own mount effect and reset the selection to -1.
    if (!home) setActiveNode(nodeIndexForPath(pathname));
  }, [pathname, setPhase, setActiveNode]);

  // Pupil travel is bounded so it can never cross its ring.
  const travel = maxPupilOffset(HOME_EYE.spacing, HOME_EYE.stroke);
  const pupilX = useTransform(px, (v) => v * travel);
  const pupilY = useTransform(py, (v) => v * travel);

  // Outer layers move less than the pupil — nearer things move more.
  const orbitLayer = useParallax(px, py, travel * 1.6);

  const isHome = phase === "home";

  return (
    <div className="relative min-h-screen text-brand-dark dark:text-brand-white">
      <div
        className={[
          "pointer-events-none fixed inset-0 z-0 flex items-center justify-center",
          "transition-opacity duration-500",
          isHome ? "opacity-100" : "opacity-0",
        ].join(" ")}
        aria-hidden={!isHome}
      >
        <div
          className="pointer-events-auto relative"
          style={{ width: "min(70vmin, 520px)", height: "min(70vmin, 520px)" }}
        >
          <Eye params={HOME_EYE} size={320} pupilX={pupilX} pupilY={pupilY} className="h-full w-full" />
          {/* motion.div, not div: reading a motion value with .get() inside a
              style object would sample it once at render and never update. */}
          <motion.div className="absolute inset-0" style={{ x: orbitLayer.x, y: orbitLayer.y }}>
            <Orbit radius={210} dotSize={22} />
          </motion.div>
        </div>
      </div>

      {children}
    </div>
  );
}
```

- [ ] **Step 2: Wire Scene into the layout and drop the old chrome**

In `webapp/src/app/layout.tsx`: remove the `Header` and `Footer` imports and their JSX, import `Scene`, and wrap `{children}`.

Replace these two import lines:

```tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
```

with:

```tsx
import Scene from "@/components/eye/Scene";
```

Then replace the body contents:

```tsx
      <body className={`${rubik.variable} ${funnelDisplay.variable} flex min-h-screen flex-col font-sans bg-brand-white text-brand-dark dark:bg-brand-dark dark:text-brand-white`}>
        <Scene>{children}</Scene>
      </body>
```

- [ ] **Step 3: Empty the homepage**

`Scene` owns the homepage entirely, so replace the whole contents of `webapp/src/app/page.tsx` with:

```tsx
/** The homepage is the scene itself, which lives in the layout. Nothing to add here. */
export default function Home() {
  return null;
}
```

- [ ] **Step 4: Strip the squircle utility from `globals.css`**

Delete this block entirely — `corner-shape` has thin browser support and does nothing useful in a design built from circles:

```css
@layer utilities {
  [class*="rounded"] {
    corner-shape: squircle;
  }
}
```

Leave everything else in the file intact: the brand tokens, the dark-mode grey remap, the typography plugin, and the marquee keyframes that `MaintenanceBanner` still needs.

- [ ] **Step 5: Delete the old chrome**

```bash
git rm src/components/Header.tsx src/components/Footer.tsx
```

- [ ] **Step 6: Verify the build**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all green. TypeScript will flag any file still importing `Header` or `Footer` — there should be none, since only `layout.tsx` referenced them.

- [ ] **Step 7: Run it and look**

Run: `npm run dev`
Open `http://localhost:3000`. Expected: the eye centred on white, pupil following the cursor without leaving its ring, five dots orbiting. Navigating to `/blog` fades the eye out; the rail arrives in Task 8.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat: mount the eye as the persistent layout shell

Scene lives in the root layout, so App Router keeps it alive across navigations
with no portal tricks. Pupil travel is clamped by maxPupilOffset so it can never
cross its ring.

Deletes Header and Footer — the eye and rail replace both. Drops the
corner-shape squircle utility.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: The docked rail and the transition bloom

**Files:**
- Create: `webapp/src/components/eye/Rail.tsx`
- Modify: `webapp/src/components/eye/Scene.tsx`

**Interfaces:**
- Consumes: `Eye`, `NODES`, `useSceneStore`. (Rail builds its own dot list; it does not render `Orbit`.)
- Produces: default export `Rail`, props `{ pupilX?: MotionValue<number>; pupilY?: MotionValue<number> }`.

- [ ] **Step 1: Create `Rail.tsx`**

```tsx
"use client";

import Link from "next/link";
import { type MotionValue } from "motion/react";
import Eye from "./Eye";
import { NODES } from "@/config/nodes";
import { useSceneStore } from "@/stores/scene";

/** Docked eye: same parameters, smaller stroke so it stays legible at 56px. */
const RAIL_EYE = { pupil: 17, spacing: 15, count: 2, stroke: 9 };

/**
 * The docked state. On desktop the orbit straightens into a vertical spine
 * beneath the eye; on mobile it becomes an arc pinned to the left edge.
 */
export default function Rail({
  pupilX,
  pupilY,
}: {
  pupilX?: MotionValue<number>;
  pupilY?: MotionValue<number>;
}) {
  const activeNode = useSceneStore((s) => s.activeNode);

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <Link href="/" aria-label="Home" className="block w-14 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2">
        <Eye params={RAIL_EYE} size={100} pupilX={pupilX} pupilY={pupilY} className="h-full w-full" />
      </Link>

      <nav aria-label="Sections" className="flex flex-col items-center gap-4">
        {NODES.map((node, i) => {
          const isActive = activeNode === i;
          return (
            <Link
              key={node.slug}
              href={node.href}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={[
                  "block rounded-full bg-current transition-all duration-200",
                  isActive
                    ? "h-4 w-4 ring-2 ring-brand-orange ring-offset-2"
                    : "h-2.5 w-2.5 opacity-40 group-hover:opacity-100",
                ].join(" ")}
              />
              {/* Label appears on hover and focus; always present for assistive tech. */}
              <span className="pointer-events-none absolute left-7 whitespace-nowrap text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {node.label}
              </span>
              <span className="sr-only">{node.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Render the Rail from Scene when docked**

In `Scene.tsx`, add the `Rail` import:

```tsx
import Rail from "./Rail";
```

Then replace the single `{children}` line with a docked layout that sits beside the rail:

```tsx
      {!isHome && (
        <div className="relative z-10 flex min-h-screen">
          <aside className="sticky top-0 h-screen flex-none border-r border-brand-dark/10 dark:border-brand-white/10">
            <Rail pupilX={pupilX} pupilY={pupilY} />
          </aside>
          <main className="min-w-0 flex-1 px-8 py-12">{children}</main>
        </div>
      )}
      {isHome && children}
```

- [ ] **Step 3: Animate the bloom across the transition**

Still in `Scene.tsx`, add the bloom. **Extend the existing import lines — do not
add second imports from `motion/react` or `react`, which would be a duplicate
declaration.** After editing, the two lines must read exactly:

```tsx
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import { useEffect, useState } from "react";
```

Add this beneath the existing `useEffect`:

```tsx
  // Ring count blooms 2 -> 8 -> 2 on every navigation. Held in a motion value so
  // the tween itself is frame-driven; mirrored into state only because
  // ringGeometry runs at render time.
  const bloom = useMotionValue(0);
  const [bloomT, setBloomT] = useState(0);
  useMotionValueEvent(bloom, "change", setBloomT);

  useEffect(() => {
    const controls = animate(bloom, [0, 1, 0], {
      duration: 0.9,
      times: [0, 0.45, 1],
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [pathname, bloom]);
```

Then derive the live eye parameters from `bloomT` and pass those instead of the constant:

```tsx
  const eyeParams = {
    pupil: HOME_EYE.pupil,
    spacing: HOME_EYE.spacing - bloomT * 22,
    count: HOME_EYE.count + bloomT * 6,
    stroke: HOME_EYE.stroke - bloomT * 18,
  };
```

Update the home `<Eye>` call to `params={eyeParams}`, and recompute travel from the live values so the pupil stays contained mid-bloom:

```tsx
  const travel = maxPupilOffset(eyeParams.spacing, eyeParams.stroke);
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all green.

Run: `npm run dev` and navigate between `/` and `/blog`. Expected: rings multiply and settle; the docked rail appears on the left with the active dot ringed in orange; keyboard Tab reaches every dot with a visible orange focus ring.

- [ ] **Step 5: Commit**

```bash
git add src/components/eye/Rail.tsx src/components/eye/Scene.tsx
git commit -m "$(cat <<'EOF'
feat: add the docked rail and transition bloom

The orbit straightens into a vertical spine when docked; labels appear on hover
and focus but stay in the accessibility tree always. Ring count blooms 2 -> 8 -> 2
across a navigation, with pupil travel recomputed from the live spacing and
stroke so it stays inside its ring mid-transition.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 9: Mobile rotary and arc rail

**Files:**
- Modify: `webapp/src/components/eye/Scene.tsx`
- Modify: `webapp/src/components/eye/Rail.tsx`
- Create: `webapp/src/components/eye/useRotary.ts`

**Interfaces:**
- Consumes: `nearestNodeIndex`, `rotationForNode`, `SELECTOR_ANGLE` from `@/lib/orbit`; `NODES`.
- Produces: `useRotary(total: number): { rotation: MotionValue<number>; bind: { onWheel; onPointerDown } }`.

- [ ] **Step 1: Create `useRotary.ts`**

```ts
"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { nearestNodeIndex, rotationForNode } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Radians of orbit rotation per pixel of scroll or drag. */
const SENSITIVITY = 0.006;
/** Idle time after input before the orbit springs to the nearest node. */
const SNAP_DELAY_MS = 140;

/**
 * Turns scroll and drag into orbit rotation, snapping to the nearest node like a
 * rotary dial. The node parked at the 9 o'clock selector becomes activeNode.
 */
export function useRotary(total: number) {
  const rotation = useMotionValue(rotationForNode(0, total));
  const setActiveNode = useSceneStore((s) => s.setActiveNode);
  const reduced = useReducedMotion() ?? false;
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSnap = useCallback(() => {
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const index = nearestNodeIndex(rotation.get(), total);
      const target = rotationForNode(index, total);

      // Snap to the nearest equivalent angle so the orbit never unwinds a full turn.
      const current = rotation.get();
      const turns = Math.round((current - target) / (Math.PI * 2));
      const nearest = target + turns * Math.PI * 2;

      animate(rotation, nearest, reduced ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 24 });
      setActiveNode(index);
    }, SNAP_DELAY_MS);
  }, [rotation, total, setActiveNode, reduced]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      rotation.set(rotation.get() + e.deltaY * SENSITIVITY);
      scheduleSnap();
    },
    [rotation, scheduleSnap],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const startY = e.clientY;
      const startRotation = rotation.get();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);

      function onMove(ev: PointerEvent) {
        rotation.set(startRotation + (ev.clientY - startY) * SENSITIVITY);
      }
      function onUp() {
        target.releasePointerCapture(e.pointerId);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        scheduleSnap();
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [rotation, scheduleSnap],
  );

  useEffect(() => {
    setActiveNode(nearestNodeIndex(rotation.get(), total));
    return () => {
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, [rotation, total, setActiveNode]);

  return { rotation, bind: { onWheel, onPointerDown } };
}
```

- [ ] **Step 2: Add a media-query hook**

The rotary is mobile-only. Binding wheel handlers on desktop would hijack page
scrolling over the eye, so the gestures must be gated.

Create `webapp/src/components/eye/useMediaQuery.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

/** Matches a media query, SSR-safe (false until mounted). */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
```

- [ ] **Step 3: Drive the orbit from the rotary on small screens only**

In `Scene.tsx`, add the two new hook imports and **extend** the existing
`@/config/nodes` import with `NODES` — `nodeIndexForPath` is already imported
from Task 7, so restating it is a duplicate declaration:

```tsx
import { useRotary } from "./useRotary";
import { useMediaQuery } from "./useMediaQuery";
import { NODES, nodeIndexForPath } from "@/config/nodes";  // <- one line, not two
```

Call both hooks unconditionally, then apply the bindings only on narrow viewports
(`sm` is Tailwind's 640px breakpoint):

```tsx
  const isNarrow = useMediaQuery("(max-width: 639px)");
  const { rotation, bind } = useRotary(NODES.length);
  const rotaryBind = isNarrow ? bind : {};
```

On the `pointer-events-auto relative` wrapper div, spread `{...rotaryBind}` and
merge `touchAction` into the existing `style` object rather than passing `style`
twice. `touchAction: "none"` is only correct while the rotary is active,
otherwise it would block ordinary page scrolling on desktop:

```tsx
          style={{
            width: "min(70vmin, 520px)",
            height: "min(70vmin, 520px)",
            touchAction: isNarrow ? "none" : undefined,
          }}
```

Change the `<Orbit>` call to take the rotation:

```tsx
            <Orbit radius={210} dotSize={22} rotation={rotation} />
```

- [ ] **Step 4: Make the Rail an arc on small screens**

In `Rail.tsx`, change the `<nav>` className so the dots bow outward on narrow viewports while staying a straight spine from `sm:` up. Replace the nav's className with:

```tsx
        className="flex flex-col items-center gap-4 [&>*:nth-child(2)]:translate-x-1.5 [&>*:nth-child(3)]:translate-x-2 [&>*:nth-child(4)]:translate-x-1.5 sm:[&>*]:translate-x-0"
```

- [ ] **Step 5: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all green.

Run: `npm run dev`, open devtools device emulation at 390px wide. Expected: scrolling or dragging over the eye rotates the orbit and it springs to the nearest node; the selected node sits at 9 o'clock. On a route, the rail dots bow into a shallow arc.

- [ ] **Step 6: Commit**

```bash
git add src/components/eye/useRotary.ts src/components/eye/useMediaQuery.ts src/components/eye/Scene.tsx src/components/eye/Rail.tsx
git commit -m "$(cat <<'EOF'
feat: add the mobile rotary and arc rail

Scroll and drag rotate the orbit like a rotary dial, springing to the nearest
node after a short idle. Snapping picks the nearest equivalent angle so the
orbit never unwinds a whole turn. The docked rail bows into an arc under the sm
breakpoint.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 10: The About route

**Files:**
- Create: `webapp/src/app/about/page.tsx`
- Modify: `webapp/next.config.ts` — **remove the `/about` redirect**
- Modify: `webapp/src/app/page.tsx` (no change needed if Task 7 emptied it; verify)

**Interfaces:**
- Consumes: `strapiGet`, `mediaUrl`, `About`, `SiteLink`, `Download` from `@/lib/strapi`; `RichText`, `SocialIcon`.
- Produces: the `/about` route.

- [ ] **Step 1: Remove the blocking redirect**

`webapp/next.config.ts` currently redirects `/about` to `/` permanently, which would make the new route unreachable. In the `redirects()` array, delete this line:

```ts
      { source: "/about", destination: "/", permanent: true },
```

Keep the other two — `/links → /bookmarks` and `/brain → /` — since neither collides with a node.

**Note:** the old rule was `permanent: true`, so browsers that already followed it have it cached (a 308). Test in a private window, or clear the site's cache, or the old redirect will appear to persist.

- [ ] **Step 2: Create the About page**

This is where the deleted footer's social row and downloads now live.

```tsx
import RichText from "@/components/RichText";
import SocialIcon from "@/components/SocialIcon";
import {
  mediaUrl,
  strapiGet,
  type About,
  type Download,
  type SiteLink,
  type StrapiList,
  type StrapiSingle,
} from "@/lib/strapi";

async function getAbout(): Promise<About | null> {
  try {
    const res = await strapiGet<StrapiSingle<About>>("/about", { populate: "portrait" });
    return res.data;
  } catch {
    return null;
  }
}

/** My own accounts. Bookmarks live on /bookmarks. */
async function getSocialLinks(): Promise<SiteLink[]> {
  try {
    const res = await strapiGet<StrapiList<SiteLink>>("/links", {
      sort: "order:asc",
      "pagination[pageSize]": "100",
      "filters[type][$eq]": "social",
    });
    return res.data;
  } catch {
    return [];
  }
}

async function getDownloads(): Promise<Download[]> {
  try {
    const res = await strapiGet<StrapiList<Download>>("/downloads", {
      populate: "file",
      sort: "title:asc",
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function generateMetadata() {
  const about = await getAbout();
  return {
    title: about?.displayName ? `About — ${about.displayName}` : "About",
    description: about?.metaDescription ?? undefined,
  };
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function AboutPage() {
  const [about, links, downloads] = await Promise.all([getAbout(), getSocialLinks(), getDownloads()]);
  if (!about) return <div className="max-w-2xl">Nothing here yet.</div>;

  const portrait = mediaUrl(about.portrait);
  const hasStatement = Array.isArray(about.statement) && about.statement.length > 0;

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start gap-6">
        {portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={portrait}
            alt={about.portrait?.alternativeText ?? about.displayName}
            width={96}
            height={96}
            className="rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-funnel text-5xl font-bold leading-tight">{about.displayName}</h1>
            {about.lookingForWork && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Open to work
              </span>
            )}
          </div>
          {about.pronouns && <p className="mt-1 text-sm text-gray-400">{about.pronouns}</p>}
          {about.headline && <p className="mt-1 text-gray-500">{about.headline}</p>}
        </div>
      </div>

      {about.shortBio && <p className="mt-8 text-gray-600 dark:text-gray-400">{about.shortBio}</p>}

      <div className="mt-6">
        <RichText content={about.bio} />
      </div>

      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 py-4 dark:border-gray-800">
        <Fact label="Location" value={about.location} />
        <Fact label="Currently" value={about.currently} />
      </dl>

      {hasStatement && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Statement
          </h2>
          <RichText content={about.statement} />
        </section>
      )}

      {links.length > 0 && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Elsewhere
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="text-gray-500 transition-colors hover:text-brand-dark dark:hover:text-brand-white"
              >
                <SocialIcon url={link.url} title={link.title} iconKey={link.iconKey} />
                <span className="sr-only">{link.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {downloads.length > 0 && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Files
          </h2>
          <ul className="space-y-1 text-sm">
            {downloads.map((download) => {
              const href = mediaUrl(download.file);
              if (!href) return null;
              return (
                <li key={download.id}>
                  <a href={href} download className="underline underline-offset-2">
                    {download.title}
                  </a>
                  {download.description && (
                    <span className="ml-2 text-gray-400">{download.description}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {about.email && (
        <p className="mt-10 text-sm">
          <a href={`mailto:${about.email}`} className="underline underline-offset-2">
            {about.email}
          </a>
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev` and open `http://localhost:3000/about` **in a private window** (the old 308 may be cached). Expected: the About content renders beside the docked rail, with the social icons and downloads that used to sit in the footer. With the CMS down it renders "Nothing here yet." rather than crashing.

- [ ] **Step 4: Commit**

```bash
git add src/app/about/page.tsx next.config.ts
git commit -m "$(cat <<'EOF'
feat: add the About route

Rehomes the deleted footer's social links and downloads alongside the About
single type.

Removes the /about -> / permanent redirect, which would otherwise have made the
new route unreachable. That rule was a 308, so cached browsers need a private
window to see the change.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 11: The Things route

**Files:**
- Create: `webapp/src/app/things/page.tsx`

**Interfaces:**
- Consumes: `strapiGet`, `mediaUrl`, `Thing`, `StrapiList` from `@/lib/strapi`.
- Produces: the `/things` route.

**Risk:** the `/api/things` endpoint is unverified — the CMS was unreachable when this plan was written. `strapiGet` throws on a non-OK response, and the `try/catch` below turns that into an empty list, so a missing collection degrades to an empty state instead of a crash. Do not block on this.

- [ ] **Step 1: Create the page**

```tsx
import { mediaUrl, strapiGet, type StrapiList, type Thing } from "@/lib/strapi";

export const metadata = { title: "Things" };

async function getThings(): Promise<Thing[]> {
  try {
    const res = await strapiGet<StrapiList<Thing>>("/things", {
      sort: "name:asc",
      "pagination[pageSize]": "100",
      "populate[media][fields][0]": "url",
      "populate[media][fields][1]": "alternativeText",
      "populate[tags][fields][0]": "name",
      "populate[tags][fields][1]": "slug",
    });
    return res.data;
  } catch {
    // The collection may not exist yet — degrade to an empty state.
    return [];
  }
}

export default async function ThingsPage() {
  const things = await getThings();

  return (
    <div className="max-w-4xl">
      <h1 className="font-funnel text-4xl font-bold">Things</h1>
      <p className="mt-2 text-gray-500">Objects I own, collected, or made.</p>

      {things.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Nothing catalogued yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {things.map((thing) => {
            const cover = mediaUrl(thing.media?.[0]);
            return (
              <li key={thing.id}>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={thing.media?.[0]?.alternativeText ?? thing.name}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <h2 className="text-sm font-medium">{thing.name}</h2>
                  {thing.isSelf && (
                    <span className="text-xs text-brand-orange" title="I made this">
                      made
                    </span>
                  )}
                </div>
                {thing.type && <p className="text-xs text-gray-400">{thing.type}</p>}
                {thing.notes && <p className="mt-1 text-xs text-gray-500">{thing.notes}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npx tsc --noEmit && npm run lint`
Expected: no errors.

Run: `npm run dev` and open `/things`. Expected: with the CMS down, the heading renders with "Nothing catalogued yet." below it.

- [ ] **Step 3: Commit**

```bash
git add src/app/things/page.tsx
git commit -m "$(cat <<'EOF'
feat: add the Things route

Renders the Thing collection as a grid, marking the ones I made. Degrades to an
empty state if the collection does not exist in Strapi yet.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 12: Fit the existing content routes to the docked layout

The blog, projects and bookmarks pages — plus `error.tsx` and `loading.tsx` — each wrap themselves in their own `<main>`, which now double-wraps the `<main>` that `Scene` provides. Strip the outer element from each. All seven files are listed below; `loading.tsx` is easy to miss and Step 3's assertion fails without it.

**Files:**
- Modify: `webapp/src/app/blog/page.tsx`
- Modify: `webapp/src/app/blog/[slug]/page.tsx`
- Modify: `webapp/src/app/projects/page.tsx`
- Modify: `webapp/src/app/projects/[slug]/page.tsx`
- Modify: `webapp/src/app/bookmarks/page.tsx`
- Modify: `webapp/src/app/error.tsx`
- Modify: `webapp/src/app/loading.tsx`

- [ ] **Step 1: Find every duplicated wrapper**

```bash
grep -rn "<main" src/app/
```

Expected: one hit per content route, plus the `<main>` that `Scene` renders.

- [ ] **Step 2: Replace each page's outer `<main>` with a plain `<div>`**

In each file listed above, the outermost element is a `<main>` carrying layout padding such as `className="flex-1 px-8 py-12"`. `Scene` now owns that padding. Change each outer `<main ...>` to `<div>` and its closing `</main>` to `</div>`, dropping the `flex-1 px-8 py-12` classes but keeping any other classes on that element.

Do not touch nested `<section>`, `<article>` or `<h1>` elements — only the outermost wrapper.

- [ ] **Step 3: Verify there is exactly one `<main>` left**

```bash
grep -rn "<main" src/
```

Expected: exactly one hit, in `src/components/eye/Scene.tsx`. Multiple `<main>` elements on a page are an accessibility error.

- [ ] **Step 4: Verify the build**

Run: `npx tsc --noEmit && npm run lint && npm test`
Expected: all green.

Run: `npm run dev` and visit `/`, `/projects`, `/blog`, `/bookmarks`, `/about`, `/things`. Expected: consistent padding beside the rail on every route, no doubled indentation, the eye persisting across all navigations without remounting.

- [ ] **Step 5: Commit**

```bash
git add src/app
git commit -m "$(cat <<'EOF'
refactor: adapt content routes to the docked layout

Scene supplies the page main element and its padding, so each route drops its
own wrapper. Leaves exactly one main element per page.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Self-Review Notes

**Spec coverage.** Every spec section maps to a task: generator → 1; orbit and node config → 2; Eye → 3; pointer and parallax → 4; store → 5; accessible nav → 6; persistence, chrome deletion and globals.css → 7; rail and bloom → 8; mobile rotary → 9; About with rehomed footer content → 10; Things → 11; content routes → 12.

**Two things this plan adds beyond the spec.**

1. The `/about → /` permanent redirect in `next.config.ts:24` would have made the About node unreachable. Removed in Task 10, with a note that the cached 308 needs a private window to verify.
2. The spec described rings as 1-based. Circularity is 0-based with `k=0` as the pupil, so the plan uses circularity's indexing throughout and the Global Constraints say so explicitly.

**Deliberate deviation from circularity.** `u` is clamped to 1. Circularity never sees a fractional `count`, so it cannot overshoot; this port can, and an unclamped `u` would push the partial outermost ring past full morph.

**Not covered by tests.** Component rendering, pointer behaviour, the rotary gesture and the bloom are verified by running the app, per the spec. Only the three pure modules — `circularity.ts`, `orbit.ts` — carry unit tests.
