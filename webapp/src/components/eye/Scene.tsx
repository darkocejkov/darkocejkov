"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Eye from "./Eye";
import Orbit from "./Orbit";
import Rail from "./Rail";
import { useParallax, usePointer } from "./usePointer";
import { useRotary } from "./useRotary";
import { useMediaQuery } from "./useMediaQuery";
import { useElementSize } from "./useElementSize";
import ThemeToggle from "@/components/ThemeToggle";
import { NODES, nodeIndexForPath } from "@/config/nodes";
import { maxPupilOffset, nearestNodeIndex } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Resting eye: pupil plus exactly one ring — the mockup. */
const HOME_EYE = { pupil: 46, spacing: 40, count: 2, stroke: 26 };

/** Seconds the page-transition wave takes end to end. */
const BLOOM_DURATION = 2.2;
/** Rings the wave adds beyond the resting eye at full extent. */
const BLOOM_RINGS = 12;
/** Fraction of the wave elapsed before the inner rings start fading out. */
const FADE_START = 0.3;
/** Seconds the eye takes to arrive or leave. */
const PRESENCE_DURATION = 0.75;
/** Radians the orbit sweeps through as the satellites arrive or leave. */
const ORBIT_SPIN = Math.PI / 3;
/** Seconds the satellites take to sweep out, starting immediately. */
const ORBIT_EXIT = 0.55;
/** Seconds the satellites take to sweep in, and how long they hold off. */
const ORBIT_ENTER = 0.9;
const ORBIT_ENTER_DELAY = 0.35;
/**
 * Decelerating. The eye arrives quickly and settles; easing in at both ends
 * reads as sluggish over three quarters of a second.
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

  // Ring count blooms 2 -> 8 -> 2 on every navigation. Held in a motion value so
  // the tween itself is frame-driven; mirrored into state only because
  // ringGeometry runs at render time.
  const bloom = useMotionValue(0);
  const [bloomT, setBloomT] = useState(0);
  useMotionValueEvent(bloom, "change", setBloomT);

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

  // One effect owns the whole transition — the ring wave and the eye's own
  // arrival and departure. Splitting them meant the eye's target was computed
  // from `isHome`, which flips the instant the route changes, while the wave
  // only registered a frame later; for those frames the eye was aiming at
  // absent and visibly dipped before climbing back.
  useEffect(() => {
    const home = pathname === "/";
    const ease = PRESENCE_EASE;

    if (reduced) {
      bloom.set(0);
      presence.set(home ? 1 : 0);
      orbitPresence.set(home ? 1 : 0);
      orbitSpin.set(0);
      return;
    }

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

    let exit: ReturnType<typeof animate> | undefined;

    const wave = animate(bloom, 1, {
      duration: BLOOM_DURATION,
      ease: "easeOut",
      onComplete: () => {
        // Every ring past the resting one has already faded to nothing by the
        // end of the wave, so resetting the count here is invisible.
        bloom.set(0);
        // Leaving, the fade front has already consumed every ring including
        // the iris, so there is nothing left to see — this just clears the
        // empty overlay. Arriving home, the eye stays.
        if (!home) exit = animate(presence, 0, { duration: 0.2, ease });
      },
    });

    return () => {
      enter.stop();
      wave.stop();
      exit?.stop();
      orbitAnims.forEach((a) => a.stop());
    };
  }, [pathname, bloom, presence, orbitPresence, orbitSpin, reduced]);

  // The transition is a wave, not a bloom-and-retract. Rings are born just
  // outside the resting ring and march outward for the whole animation, while
  // a fade front chases them from the inside — so the set fills outward and
  // then empties in the same direction, rather than expanding and reversing.
  //
  // Spacing and stroke stay constant, so the rings keep a uniform weight and
  // an even gap. Ring k sits at pupil + spacing * k, so the outermost reaches
  // 46 + 40 * 13 = 566 units. The SVG is overflow:visible, so the wave spills
  // past its box rather than being clipped.
  const eyeParams = {
    pupil: HOME_EYE.pupil,
    spacing: HOME_EYE.spacing,
    count: HOME_EYE.count + bloomT * BLOOM_RINGS,
    stroke: HOME_EYE.stroke,
  };

  // Arriving home, the eye has to survive the transition, so the front is
  // held off the pupil and resting ring and waits for the wave to gain some
  // depth first. Leaving for a content route it starts immediately and is
  // allowed to consume everything: the iris goes first and the eye empties
  // from its centre outwards, which is how it departs — rather than sitting
  // there and fading out as a whole once the wave is over.
  const protectCore = isHome;
  const fadeStart = protectCore ? FADE_START : 0;
  const innerFade =
    bloomT <= fadeStart
      ? 0
      : ((bloomT - fadeStart) / (1 - fadeStart)) * (BLOOM_RINGS + 2);

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
        >
          <Eye
            params={eyeParams}
            size={320}
            pupilX={pupilX}
            pupilY={pupilY}
            ringX={ringX}
            ringY={ringY}
            innerFade={innerFade}
            protectCore={protectCore}
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
            <Rail px={px} py={py} />
          </aside>
          <main className="min-w-0 flex-1 px-8 py-12">{children}</main>
        </div>
      )}
      {isHome && children}
    </div>
  );
}
