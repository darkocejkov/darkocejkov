# The Eye — site redesign around a persistent circularity shell

**Date:** 2026-09-13
**Status:** Approved, ready for implementation planning

## Concept

The site is one continuous scene rather than a set of pages. A two-circle "eye" — a filled
pupil inside a single heavy ring — sits at the centre of the viewport. The pupil tracks the
cursor. Five circles orbit the eye, one per section. The whole scene has parallax depth.

The eye is not a bespoke drawing. It is one instance of a general parametric ring generator
(ported from [circularity](https://github.com/darkocejkov/circularity)) constrained to
`count: 2`. Page transitions animate that instance's parameters, so the eye blooms into many
rings and settles again. The generator carries circularity's full parameter set with neutral
defaults, so enabling distortion later is passing a number rather than rewriting anything.

Palette is the existing brand pair: `#011627` navy on `#FDFFFC` white, inverting in dark mode.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Navigation model | Eye persists across routes and morphs into chrome | A scene, not a hero image. Content fades in beside it; nothing unmounts. |
| Eye fidelity | Full circularity engine, instance constrained to radius / spacing / count / stroke | Keeps the clean silhouette of the mockup while leaving the whole parameter space available for later animation. |
| Live parameters | `pupil`, `spacing`, `count`, `stroke` only | No growth, taper, morph, lobes, twist or amplitude for now. Every ring stays an exact `<circle>`; nothing is ever sampled to a path. |
| Docked layout | Edge rail — eye to the left edge, orbit straightens into a vertical spine of dots | Circles stay circles; the nav never degrades into an ordinary list. |
| Mobile | Rotary orbit on home, arc rail on routes | Scroll rotates the orbit like a rotary dial. The orbit survives navigation as a partial arc rather than flattening to a bar. |
| Theme | Keep light and dark | The existing dark-mode grey remapping is working code. The eye inverts rather than being redrawn. |
| Test runner | Add vitest | The generator is pure math and deserves real unit tests. |

### Why constraining the generator mattered

Circularity ramps morph and wave by `u = k / (count - 1)` — a ring's *position within the
set*. Animating `count` therefore changes every existing ring's character: ring 1 slides from
`u = 1.0` to `u = 0.125` as the set grows, un-morphing as it goes. Resolving that would have
meant choosing between a faithful ripple (which makes the resting eye a wavy hexagon, not the
clean circle in the mockup) and a fixed normalisation (which loses the ripple).

Constraining to radius, spacing, count and stroke dissolves the question: with no morph and no
wave, nothing ramps. The decision is deferred, not lost — the parameters remain in the API.

## Architecture

Four units, each independently understandable and testable.

### 1. `src/lib/circularity.ts` — the generator

Pure functions. No React, no DOM, no side effects. This is the seam that makes the whole ring
system testable without a browser.

```ts
export interface RingParams {
  // Live
  pupil: number;           // radius of the filled centre disc
  spacing: number;         // gap between consecutive rings
  count: number;           // fractional permitted; see below
  stroke: number;          // base stroke width

  // Dormant — neutral defaults reproduce plain circles
  spacingGrowth?: number;  // g,  default 1
  taper?: number;          // t,  default 1
  outerSides?: number;     // 0 = remain a circle
  morphCurve?: number;     // default 1
  amplitude?: number;      // 0 = no wave
  lobes?: number;          // default 6
  waveRamp?: number;       // default 1
  twist?: number;          // default 0
  rotation?: number;       // default 0
}

export interface Ring {
  k: number;               // ring index, 1-based
  r: number;               // inscribed radius
  strokeWidth: number;
  opacity: number;
  d?: string;              // only when the ring needs sampling
}

export function ringGeometry(p: RingParams): Ring[];
```

**Radius.** Ring `k` has inscribed radius `pupil + spacing * Σ(i=0..k-1) gⁱ`. With `g = 1`
this reduces to `pupil + spacing * k`.

**Stroke.** Ring `k` has width `stroke * taperᵏ`. With `taper = 1` this is uniform.

**Fractional count.** Let `whole = floor(count)` and `frac = count - whole`. Rings `1 …
whole-1` render fully. When `frac > 0`, ring `whole` renders with `opacity = frac` and
`strokeWidth` scaled by `frac`, so it fades in at the rim rather than popping into existence.
This is what makes `count` animatable. `count: 2` yields exactly one ring plus the pupil — the
mockup.

**Path emission.** `d` is populated only when a ring is mid-morph or wavy. Under the live
constraints it is never populated, so consumers render `<circle>` throughout. Keeping the
branch present means enabling distortion later requires no change at the call site.

### 2. `src/stores/scene.ts` — discrete state only

Zustand, already a dependency. Holds **only** state that changes at human speed:

- `phase: "home" | "docked"`
- `activeNode: number`
- `reducedMotion: boolean`

Pointer position is deliberately **not** here. Pushing 60 fps pointer updates through zustand
would re-render React every frame.

### 3. Continuous motion — `motion` motion values

Already a dependency. Carries everything that changes per frame, animating outside React's
render cycle:

- pointer offset, normalised to `-1 … 1` on both axes
- per-layer parallax translation
- orbit rotation (mobile rotary)
- transition progress `t`

Springs are tuned so the pupil responds faster than the outer layers — the lag *is* the depth
cue.

**Pupil travel is bounded.** Maximum pupil offset must satisfy
`offset ≤ (innerRingRadius - strokeWidth / 2) - pupil`, so the pupil never collides with or
escapes its ring.

### 4. Components — `src/components/eye/`

| Component | Responsibility |
|---|---|
| `Scene.tsx` | Root client component in the layout. Owns pointer listeners and phase. |
| `Eye.tsx` | Consumes `ringGeometry`, renders the SVG. Presentational. |
| `Orbit.tsx` | Positions satellites; owns rotary rotation on mobile. |
| `Rail.tsx` | Docked-state spine (desktop) and arc (mobile). |

## Routing and persistence

Next.js App Router keeps `layout.tsx` mounted across route changes, so mounting `<Scene>` in
the root layout gives genuine persistence with no portals or hacks. `usePathname()` drives
phase: `/` is `home`, everything else is `docked`.

Route children animate in beside the docked eye.

## Navigation must be real links

The satellites render as actual `<Link>` elements, absolutely positioned over the SVG at their
orbit coordinates. The SVG itself is `aria-hidden="true"` decoration.

A nav built from `<circle onClick>` is unreachable by keyboard and invisible to screen readers.
This is a hard requirement, not a preference.

- Focus ring uses brand orange `#FF9F1C`, matching the active-node treatment in the mockup.
- Tab order follows `NODES` order.
- Each link carries its visible label as accessible text even when the label is hover-only.

## Node configuration — `src/config/nodes.ts`

Orbit positions derive from index and array length, so adding a sixth node is one line.

```ts
export const NODES = [
  { slug: "work",      href: "/projects",  label: "Work" },
  { slug: "blog",      href: "/blog",      label: "Blog" },
  { slug: "bookmarks", href: "/bookmarks", label: "Bookmarks" },
  { slug: "about",     href: "/about",     label: "About" },
  { slug: "things",    href: "/things",    label: "Things" },
];
```

## Interaction

**Cursor tracking.** Pointer normalised against the viewport to `-1 … 1`. The pupil translates
by that vector scaled to its bounded maximum. Rings translate by a smaller factor, satellites
by a larger one — nearer layers move more.

**Transition bloom.** On route change, `t` animates `0 → 1 → 0`. Across the bloom:
`count: 2 → 8`, `spacing` tightens, `stroke` thins. The eye then settles at `count: 2`, scaled
down, at the rail position.

**Mobile rotary.** Orbit rotation is a motion value driven by scroll and drag. On release it
springs to the nearest node angle. The selector position is 9 o'clock (180°), matching the
mockup's left-hand highlight. The node nearest the selector is `activeNode`.

**Reduced motion.** Under `prefers-reduced-motion`, parallax and bloom are disabled, transitions
become instant, and the orbit is static. Layout and navigation are unaffected.

## Content mapping

Existing Strapi types in `src/lib/strapi.ts` drive each node:

| Node | Route | Source |
|---|---|---|
| Work | `/projects` | `Project` (exists) |
| Blog | `/blog` | `Article` (exists) |
| Bookmarks | `/bookmarks` | `SiteLink` where `type = "bookmark"` (exists) |
| About | `/about` | `About` single type, plus the social links and `Download` list rehomed from the deleted footer |
| Things | `/things` | `Thing` (type defined; endpoint unverified — see Risks) |

## File plan

**Delete**

- `src/components/Header.tsx` — the eye and rail replace it
- `src/components/Footer.tsx` — social row and downloads move into `/about`

**Strip**

- `src/app/globals.css` — reduce to brand tokens, dark-mode grey remap, typography plugin, and
  the marquee keyframes that `MaintenanceBanner` still needs. Remove the
  `corner-shape: squircle` utility: support is thin and it does nothing useful in a design
  built from circles.

**New**

- `src/lib/circularity.ts`
- `src/components/eye/{Scene,Eye,Orbit,Rail}.tsx`
- `src/stores/scene.ts`
- `src/config/nodes.ts`
- `src/app/about/page.tsx`
- `src/app/things/page.tsx`

**Restyled, not rebuilt**

- `src/app/blog/`, `src/app/projects/`, `src/app/bookmarks/`

**Untouched**

- `Markdown`, `RichText`, `SocialIcon`, `BlogList`, `MaintenanceBanner`, `ThemeToggle`
- `src/lib/strapi.ts`

## Testing

Add **vitest**. No jsdom initially — the generator is pure and needs no DOM.

`circularity.ts` unit tests:

1. Ring radii follow `pupil + spacing * k` when `spacingGrowth = 1`
2. `spacingGrowth` compounds correctly across rings
3. `taper` applies to stroke width per ring index
4. `count: 2` yields exactly one ring plus the pupil
5. Fractional `count` gives the outermost ring `opacity === frac`
6. Neutral parameters emit no `d` on any ring — circles, never paths
7. `amplitude > 0` or `outerSides >= 3` does populate `d`

Component and interaction behaviour is verified by running the app, not by test.

## Risks and assumptions

1. **`/api/things` is unverified.** The CMS was not running when this spec was written, so the
   `Thing` collection's existence is assumed from the type definition alone. If the endpoint is
   absent, the Things node ships as an empty state rather than blocking the redesign.
2. **Parallax cost on low-end mobile.** Mitigated by honouring `prefers-reduced-motion` and by
   keeping the number of independently-transformed layers small.
3. **Pupil containment.** The bound on pupil travel must be recomputed whenever `pupil`,
   `spacing` or `stroke` animate, or the pupil can escape its ring mid-transition.

## Out of scope

- Enabling morph, wave, taper or growth. The parameters exist; nothing drives them yet.
- Reinstating a CV or résumé section.
- Any change to the Strapi schema.
