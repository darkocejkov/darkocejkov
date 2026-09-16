"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Eye from "./Eye";
import Orbit from "./Orbit";
import Rail from "./Rail";
import { useParallax, usePointer } from "./usePointer";
import { useRotary } from "./useRotary";
import { useBlink } from "./useBlink";
import { useMediaQuery } from "./useMediaQuery";
import { useElementSize } from "./useElementSize";
import ThemeToggle from "@/components/ThemeToggle";
import { NODES, nodeIndexForPath } from "@/config/nodes";
import { maxPupilOffset, nearestNodeIndex } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Resting eye: pupil plus exactly one ring — the mockup. */
const HOME_EYE = { pupil: 46, spacing: 40, count: 2, stroke: 26 };

/** viewBox edge the eye is drawn in. The wave is sized in these units. */
const EYE_VIEWBOX = 320;

/**
 * The wave's own spacing and stroke, far finer than the resting eye's. Kept
 * separate rather than shared so tightening the wave cannot drag the resting
 * ring in onto the iris — see Eye's `wave` prop.
 */
const WAVE_SPACING = 14;
/**
 * Half the spacing, so ring and gap carry equal weight. Going heavier than
 * this inverts the wave — the gaps become the figure and the rings the ground.
 */
const WAVE_STROKE = 7;
/**
 * Radius of the wave's innermost ring: clear of the resting ring's outer edge
 * by one of the wave's own gaps, so the two sets read as continuous.
 */
const WAVE_START = HOME_EYE.pupil + HOME_EYE.spacing + HOME_EYE.stroke / 2 + WAVE_SPACING;
/** Floor for the ring count, used until the viewport has been measured. */
const MIN_WAVE_RINGS = 12;

/**
 * The transition is two phases, not one. The wave first fills the screen
 * outright, and only once it has covered everything does the fade front start
 * from the centre and wipe it away. They used to overlap, which meant the
 * rings were already thinning at the middle while the outside was still
 * arriving and the screen was never actually full.
 */
const FILL_DURATION = 0.7;
const DRAIN_DURATION = 0.45;
/**
 * How much of a ring index an arriving ring takes to reach full opacity. Small
 * enough that a ring is essentially on the moment it exists, rather than
 * drifting up behind the wave front.
 */
const RING_BIRTH_FADE = 0.07;
/** Seconds the eye takes to arrive or leave. */
const PRESENCE_DURATION = 0.4;
/** Radians the orbit sweeps through as the satellites arrive or leave. */
const ORBIT_SPIN = Math.PI / 3;
/** Seconds the satellites take to sweep out, starting immediately. */
const ORBIT_EXIT = 0.32;
/**
 * Seconds the satellites take to sweep in, and how long they hold off. They
 * wait out the fill and arrive on the wipe — coming in any earlier puts them
 * on top of the densest part of the wave, where they just read as clutter.
 */
const ORBIT_ENTER = 0.45;
const ORBIT_ENTER_DELAY = FILL_DURATION;
/**
 * The iris leaves by closing. Quantising the tween's progress into this many
 * held frames gives the same stop-motion feel as an idle blink, rather than a
 * smooth sweep that would read as a different eye entirely — four steps lands
 * on the 25/50/75/shut the blink already uses.
 */
const LID_STEPS = 4;
const LID_DURATION = 0.22;
const steppedLid = (t: number) => Math.ceil(t * LID_STEPS) / LID_STEPS;
/**
 * Decelerating. The eye arrives quickly and settles; easing in at both ends
 * reads as sluggish even over this shorter run.
 */
const PRESENCE_EASE = [0.22, 1, 0.36, 1] as const;

export default function Scene({
  children,
  maintenanceBanner,
}: {
  children: React.ReactNode;
  maintenanceBanner?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { px, py, reduced } = usePointer();
  const setPhase = useSceneStore((s) => s.setPhase);
  const setActiveNode = useSceneStore((s) => s.setActiveNode);

  const isNarrow = useMediaQuery("(max-width: 639px)");
  const isHome = pathname === "/";
  const { rotation, engaged, bind } = useRotary(NODES.length);
  const { blink, trigger: triggerBlink } = useBlink();

  // The rotary runs on every width, but only on the homepage. That is what
  // makes it safe on desktop: "/" renders no page content, so there is no
  // document scroll for the wheel handler to hijack. On content routes it
  // stays off at every width, where hijacking the scroll would be real.
  const rotaryLive = isHome;
  const rotaryBind = rotaryLive ? bind : {};

  // The eye container scales with the viewport (78vmin, uncapped), so the
  // orbit radius/dot size must be measured proportions of its rendered size
  // rather than fixed pixels — otherwise satellites drift off the rings as
  // the eye grows or shrinks.
  const { ref: eyeContainerRef, width: containerWidth } = useElementSize<HTMLDivElement>();
  const orbitRadius = (containerWidth ?? 0) * 0.404;
  const orbitDot = (containerWidth ?? 0) * (isNarrow ? 0.0586 : 0.0423);

  // The overlay is fixed inset-0, so measuring it measures the viewport. The
  // wave has to reach the far corners for "filled" to be true, and how far
  // that is depends on the aspect ratio — a fixed ring count covers 16:9 and
  // falls short of an ultrawide.
  const {
    ref: viewportRef,
    width: viewportWidth,
    height: viewportHeight,
  } = useElementSize<HTMLDivElement>();

  useEffect(() => {
    const home = pathname === "/";
    setPhase(home ? "home" : "docked");
    // The sole owner of activeNode. The write is total — every branch writes,
    // none skip — so nothing is ever left stale. On "/" the rotary is only
    // live (and thus only meaningful) when narrow; otherwise nothing is
    // selected. Off "/" the node is derived from the route. Depending on
    // isNarrow means crossing the breakpoint on a content route re-derives
    // too, instead of leaving a stale desktop-rotary value in place.
    setActiveNode(
      home
        ? (engaged ? nearestNodeIndex(rotation.get(), NODES.length) : -1)
        : nodeIndexForPath(pathname),
    );
  }, [pathname, setPhase, setActiveNode, engaged, rotation]);

  // The two phases of the wave, each 0 -> 1 and run back to back: `fill` adds
  // rings outwards until the screen is covered, then `drain` sweeps the fade
  // front through them from the centre. Held in motion values so the tweens
  // are frame-driven; mirrored into state only because ringGeometry runs at
  // render time.
  const fill = useMotionValue(0);
  const drain = useMotionValue(0);
  const [fillT, setFillT] = useState(0);
  const [drainT, setDrainT] = useState(0);
  useMotionValueEvent(fill, "change", setFillT);
  useMotionValueEvent(drain, "change", setDrainT);

  // The eye's own entrance and exit, separate from the ring wave. Previously
  // the whole overlay just switched opacity, which took the pupil and resting
  // ring with it — the eye blinked out the instant the wave finished instead
  // of leaving. It is present on the homepage, and on a content route only
  // for as long as a transition is playing.
  const presence = useMotionValue(isHome ? 1 : 0);

  // The satellites get their own arrival and departure, sweeping the orbit
  // round as they go. Riding the overlay's opacity alone meant they vanished
  // with it in one step at the very end — the same abruptness the eye had.
  const orbitPresence = useMotionValue(isHome ? 1 : 0);
  const orbitSpin = useMotionValue(isHome ? 0 : ORBIT_SPIN);

  // The iris's exit: the eye closes rather than being cut away by the fade
  // front. It rides the same lid as a blink, so the two combine by whichever
  // is further shut — a blink landing mid-exit cannot reopen it.
  const irisLid = useMotionValue(0);
  const centreLid = useTransform([blink, irisLid], ([b, l]: number[]) => Math.max(b, l));

  // One effect owns the whole transition — the ring wave and the eye's own
  // arrival and departure. Splitting them meant the eye's target was computed
  // from `isHome`, which flips the instant the route changes, while the wave
  // only registered a frame later; for those frames the eye was aiming at
  // absent and visibly dipped before climbing back.
  useEffect(() => {
    const home = pathname === "/";
    const ease = PRESENCE_EASE;

    if (reduced) {
      fill.set(0);
      drain.set(0);
      irisLid.set(0);
      presence.set(home ? 1 : 0);
      orbitPresence.set(home ? 1 : 0);
      orbitSpin.set(0);
      return;
    }

    // Restart the wave from the beginning. Stopping an animation leaves its
    // value where it stood, so navigating again mid-wave used to resume from
    // there — `animate(fill, 1)` from 0.8 is nearly a no-op, which is why a
    // quick second navigation appeared to play no animation at all.
    const interrupted = fill.get() > 0 || drain.get() > 0;
    fill.set(0);
    drain.set(0);
    // Back open, ready to close again. Arriving home this is the eye that shut
    // on the way out being reset, which is invisible: presence is still 0, so
    // the eye is not on screen yet when it happens.
    irisLid.set(0);

    // Coming in on top of an interrupted exit, the overlay is still up while
    // the reset above has just restored every ring it had faded. Drop it and
    // fade back in rather than letting that restoration show.
    if (interrupted && !home) presence.set(0);

    // Arrive first, or hold if already here.
    const enter = animate(presence, 1, { duration: PRESENCE_DURATION, ease });

    // The satellites sweep in behind the eye, or sweep out immediately — out
    // early so they leave alongside the iris rather than after the wave, in
    // late so they settle as it does.
    //
    // The sweep goes out and comes back rather than carrying on round: it is
    // an offset on top of the dial, not a turn of it, so returning it to zero
    // is what leaves the rotary's own position exactly where the reader left
    // it. Measured at -18deg before leaving and -18deg on return.
    const orbitAnims = home
      ? [
          animate(orbitPresence, 1, { duration: ORBIT_ENTER, ease, delay: ORBIT_ENTER_DELAY }),
          animate(orbitSpin, 0, { duration: ORBIT_ENTER, ease, delay: ORBIT_ENTER_DELAY }),
        ]
      : [
          animate(orbitPresence, 0, { duration: ORBIT_EXIT, ease: "easeIn" }),
          animate(orbitSpin, ORBIT_SPIN, { duration: ORBIT_EXIT, ease: "easeIn" }),
        ];

    // Phase two is started from phase one's completion rather than run
    // alongside it on a delay, so the wipe can never begin against a fill that
    // was cut short — the screen is always covered before anything leaves.
    let wipe: ReturnType<typeof animate> | null = null;
    let close: ReturnType<typeof animate> | null = null;

    const wave = animate(fill, 1, {
      duration: FILL_DURATION,
      ease: "easeOut",
      onComplete: () => {
        // Leaving, the eye shuts as the wipe starts — the two are one gesture,
        // so this hangs off the same moment rather than a delay of its own.
        // It stays open for the fill, where it is the source the wave radiates
        // from; closing it there would lose the centre of the picture.
        if (!home) {
          close = animate(irisLid, 1, { duration: LID_DURATION, ease: steppedLid });
        }

        wipe = animate(drain, 1, {
          duration: DRAIN_DURATION,
          // Linear: the front is a moving edge, and a constant ring-per-second
          // sweep is what reads as one. Easing it makes the edge visibly
          // hesitate at the centre or stall at the rim.
          ease: "linear",
          onComplete: () => {
            // Order matters. Clearing `fill` drops every ring at once, and
            // clearing `drain` restores the opacity of any the front had
            // consumed — so leaving, the overlay has to be down first, and
            // the rings have to go before the front that emptied them, or
            // that restoration shows as a flash. Nothing is lost by cutting
            // instantly: the screen is already empty by this point.
            if (!home) presence.set(0);
            fill.set(0);
            drain.set(0);
          },
        });
      },
    });

    return () => {
      enter.stop();
      wave.stop();
      wipe?.stop();
      close?.stop();
      orbitAnims.forEach((a) => a.stop());
    };
  }, [pathname, fill, drain, irisLid, presence, orbitPresence, orbitSpin, reduced]);

  // The eye itself is fixed — the resting pupil and its one ring, unchanged
  // through the whole transition. Everything that moves is the wave outside it.
  const eyeParams = HOME_EYE;

  // How many rings it takes to clear the furthest corner. The container is
  // sized in vmin but drawn in a fixed viewBox, so pixels convert to user
  // units through its measured width — which means this comes out the same on
  // any monitor of a given shape, and only grows for wider ones.
  const unitsPerPx = containerWidth ? EYE_VIEWBOX / containerWidth : 0;
  const reach =
    viewportWidth && viewportHeight
      ? 0.5 * Math.hypot(viewportWidth, viewportHeight) * unitsPerPx
      : 0;
  const waveRings = Math.max(
    MIN_WAVE_RINGS,
    Math.ceil((reach - WAVE_START) / WAVE_SPACING) + 1,
  );

  // Rings march outward for the whole fill, at constant spacing and stroke so
  // they keep a uniform weight and an even gap. The SVG is overflow:visible,
  // so the wave spills past its box rather than being clipped at it.
  const waveParams = {
    pupil: WAVE_START,
    spacing: WAVE_SPACING,
    count: fillT * waveRings,
    stroke: WAVE_STROKE,
    birthFade: RING_BIRTH_FADE,
  };

  // Arriving home, the eye has to survive the transition, so the front is held
  // off the pupil and resting ring and only wipes the wave. Leaving for a
  // content route it is allowed to consume everything: the iris goes first and
  // the eye empties from its centre outwards, which is how it departs — rather
  // than sitting there and fading out as a whole once the wave is over.
  const protectCore = isHome;
  // Indices run 0 (pupil), 1 (resting ring), then the wave. The front has to
  // overrun the outermost by the width of its own edge, or the wipe ends with
  // that ring still partly drawn and clearing the rings snaps it away.
  const innerFade = drainT * (waveRings + 2);

  // Pupil travel is bounded so it can never cross its ring. Constant now that
  // spacing and stroke no longer animate, but still derived rather than
  // hardcoded so retuning HOME_EYE cannot silently break containment.
  const travel = maxPupilOffset(eyeParams.spacing, eyeParams.stroke);
  const pupilX = useTransform(px, (v) => v * travel);
  const pupilY = useTransform(py, (v) => v * travel);

  // The rings drift with the pointer too, but less than the pupil, so the
  // pupil leads and they trail. Without this the rings are nailed down and
  // only the pupil moves, which reads as a flat sticker rather than depth.
  const ringX = useTransform(px, (v) => v * travel * 0.35);
  const ringY = useTransform(py, (v) => v * travel * 0.35);

  // Scaling with the fade is what makes it read as arriving and receding
  // rather than being switched on and off.
  const eyeScale = useTransform(presence, [0, 1], [0.82, 1]);

  // The satellites counter-move against the pointer. Moving them *with* the
  // pupil, only further, made them read as welded to the iris; opposing it
  // puts them on their own plane in front of the eye, which is what separates
  // the two. Disabled on touch: there is no hovering cursor to cue depth
  // from, and on mobile the rotary drag is the only pointer motion — feeding
  // it here displaces the snapped dot off the selector by several pixels.
  const orbitLayer = useParallax(px, py, isNarrow ? 0 : -travel * 0.8);

  // What the orbit is actually rotated by: the dial's own position plus the
  // sweep it makes on the way in or out.
  const orbitAngle = useTransform([rotation, orbitSpin], ([r, spin]: number[]) => r + spin);

  return (
    <div className="relative min-h-screen text-brand-dark dark:text-brand-white">
      {maintenanceBanner}
      <motion.div
        ref={viewportRef}
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
        style={{ opacity: presence }}
        inert={!isHome}
      >
        <motion.div
          ref={eyeContainerRef}
          className="pointer-events-auto relative"
          style={{
            scale: eyeScale,
            width: "78vmin",
            height: "78vmin",
            // Only while the rotary is live. Dragging is touch-only but is
            // not width-gated (a tablet in landscape still drags), and on a
            // content route this would otherwise be a dead scroll zone
            // sitting over the article.
            touchAction: rotaryLive ? "none" : undefined,
          }}
          {...rotaryBind}
          onPointerEnter={triggerBlink}
        >
          <Eye
            params={eyeParams}
            wave={waveParams}
            size={EYE_VIEWBOX}
            pupilX={pupilX}
            pupilY={pupilY}
            ringX={ringX}
            ringY={ringY}
            innerFade={innerFade}
            protectCore={protectCore}
            blink={centreLid}
            className="h-full w-full"
          />
          {/* motion.div, not div: reading a motion value with .get() inside a
              style object would sample it once at render and never update. */}
          <motion.div
            className="absolute inset-0"
            style={{ x: orbitLayer.x, y: orbitLayer.y, opacity: orbitPresence }}
          >
            {containerWidth !== null && (
              <Orbit radius={orbitRadius} dotSize={orbitDot} rotation={orbitAngle} />
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Sibling of the inert overlay, not inside it — otherwise it would be
          unreachable (hit-testing and Tab) on content routes. Single mount for
          every route: the original site's footer rendered it everywhere.
          z-20: the content wrapper below is also stacked (z-10) and, on
          content routes, comes later in DOM order — without a higher
          z-index its <main> would win the paint order and swallow clicks
          here even though this sits at a fixed, on-screen position. */}
      <div className="fixed bottom-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {!isHome && (
        <div className="relative z-10 flex min-h-screen">
          <aside className="sticky top-0 h-screen flex-none border-r border-brand-dark/10 dark:border-brand-white/10">
            <Rail px={px} py={py} blink={blink} onBlinkTrigger={triggerBlink} />
          </aside>
          <main className="min-w-0 flex-1 px-8 py-12">{children}</main>
        </div>
      )}
      {isHome && children}
    </div>
  );
}
