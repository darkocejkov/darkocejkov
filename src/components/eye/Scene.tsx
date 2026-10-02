"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Eye from "./Eye";
import Orbit from "./Orbit";
import { useParallax, usePointer } from "./usePointer";
import { useGaze } from "./useGaze";
import { useRotary } from "./useRotary";
import { useBlink } from "./useBlink";
import { useMediaQuery } from "./useMediaQuery";
import { useElementSize } from "./useElementSize";
import { setIrisObstacle } from "./irisObstacle";
import ThemeToggle from "@/components/ThemeToggle";
import { HOME_NODE, NODES, nodeIndexForPath } from "@/config/nodes";
import { maxPupilOffset, nearestNodeIndex } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Resting eye: pupil plus exactly one ring — the mockup. */
const HOME_EYE = { pupil: 46, spacing: 40, count: 2, stroke: 26 };

/** viewBox edge the eye is drawn in. The wave is sized in these units. */
const EYE_VIEWBOX = 320;

/** Outer edge of the resting ring, in viewBox units. */
const CORE_OUTER = HOME_EYE.pupil + HOME_EYE.spacing + HOME_EYE.stroke / 2;

/**
 * The wave's own spacing and stroke at full eye size, far finer than the
 * resting eye's. Half-spacing stroke keeps ring and gap equal weight.
 */
const WAVE_SPACING = 14;
const WAVE_STROKE = 7;
/** Floor for the ring count, used until the viewport has been measured. */
const MIN_WAVE_RINGS = 12;

/**
 * The transition is two phases: the wave fills the screen outright, then the
 * fade front wipes it away from the centre.
 */
const FILL_DURATION = 0.7;
const DRAIN_DURATION = 0.45;
/** How much of a ring index an arriving ring takes to reach full opacity. */
const RING_BIRTH_FADE = 0.07;

/** Radians the orbit sweeps through as the satellites arrive or leave. */
const ORBIT_SPIN = Math.PI / 3;
const ORBIT_EXIT = 0.32;
const ORBIT_ENTER = 0.45;

/** Docked iris on content routes: centred on desktop, bottom-centre on mobile. */
const DOCK_DURATION = 0.6;
const DOCK_SIZE = 112;
const DOCK_SIZE_NARROW = 80;
const DOCK_RADIUS = 84;
const DOCK_RADIUS_NARROW = 76;
const DOCK_ICON = 22;
const DOCK_ICON_NARROW = 24;
const DOCK_MARGIN = 24;

/** Routes whose content needs the viewport centre; the docked iris moves aside. */
const ASIDE_PATHS = new Set(["/connect"]);
/** How far left of centre the aside iris sits on desktop, as a fraction of viewport width. */
const ASIDE_SHIFT = 0.3;
/** Routes built around the iris; on mobile it stays centred instead of dropping to the bottom. */
const CENTRED_PATHS = new Set(["/bookmarks"]);

/** Decelerating: arrives quickly and settles. */
const EASE = [0.22, 1, 0.36, 1] as const;

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

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
  const orbitId = useId();

  const isNarrow = useMediaQuery("(max-width: 639px)");
  const isHome = pathname === "/";
  const { rotation, engaged, bind } = useRotary(NODES.length);
  const { blink, trigger: triggerBlink } = useBlink();

  // The satellites default to open on the homepage and tucked away elsewhere.
  // Storing only "which path was toggled" means navigating resets the default
  // without an effect having to write state.
  const [toggledOn, setToggledOn] = useState<string | null>(null);
  const open = isHome !== (toggledOn === pathname);
  const toggle = useCallback(
    () => setToggledOn((prev) => (prev === pathname ? null : pathname)),
    [pathname],
  );
  const resetToggle = useCallback(() => setToggledOn(null), []);

  // The rotary only runs on "/" with the orbit out: there is no page scroll
  // there for the wheel handler to hijack.
  const rotaryLive = isHome && open;
  const rotaryBind = rotaryLive ? bind : {};

  const { ref: eyeContainerRef, width: containerWidth } = useElementSize<HTMLDivElement>();

  // The overlay is fixed inset-0, so measuring it measures the viewport.
  const {
    ref: viewportRef,
    width: viewportWidth,
    height: viewportHeight,
  } = useElementSize<HTMLDivElement>();

  // Home sizes are derived from the viewport rather than the eye box, which
  // itself shrinks while docking.
  const homeSize =
    viewportWidth && viewportHeight ? 0.78 * Math.min(viewportWidth, viewportHeight) : null;
  const dockSize = isNarrow ? DOCK_SIZE_NARROW : DOCK_SIZE;
  const homeRadius = (homeSize ?? 0) * 0.404;
  const dockRadius = isNarrow ? DOCK_RADIUS_NARROW : DOCK_RADIUS;
  const homeIcon = (homeSize ?? 0) * (isNarrow ? 0.0586 : 0.0423);
  const dockIcon = isNarrow ? DOCK_ICON_NARROW : DOCK_ICON;

  useEffect(() => {
    setPhase(isHome ? "home" : "docked");
    setActiveNode(
      isHome
        ? (engaged ? nearestNodeIndex(rotation.get(), NODES.length) : -1)
        : nodeIndexForPath(pathname),
    );
  }, [isHome, pathname, setPhase, setActiveNode, engaged, rotation]);

  // Mirrored into state only because ringGeometry runs at render time.
  const fill = useMotionValue(0);
  const drain = useMotionValue(0);
  const [fillT, setFillT] = useState(0);
  const [drainT, setDrainT] = useState(0);
  useMotionValueEvent(fill, "change", setFillT);
  useMotionValueEvent(drain, "change", setDrainT);

  // 0 = full-size home eye, 1 = docked.
  const dock = useMotionValue(isHome ? 0 : 1);
  // 0 = docked in the middle, 1 = moved aside.
  const aside = useMotionValue(ASIDE_PATHS.has(pathname) ? 1 : 0);
  // 0 = mobile dock at the bottom, 1 = kept centred.
  const centred = useMotionValue(CENTRED_PATHS.has(pathname) ? 1 : 0);
  // 0 = satellites tucked into the iris, 1 = fanned out on the orbit.
  const spread = useMotionValue(open ? 1 : 0);
  const orbitSpin = useMotionValue(open ? 0 : ORBIT_SPIN);

  useEffect(() => {
    const home = pathname === "/";
    const asideTarget = ASIDE_PATHS.has(pathname) ? 1 : 0;
    const centredTarget = CENTRED_PATHS.has(pathname) ? 1 : 0;

    if (reduced) {
      fill.set(0);
      drain.set(0);
      dock.set(home ? 0 : 1);
      aside.set(asideTarget);
      centred.set(centredTarget);
      return;
    }

    // Restart from zero: a stopped animation keeps its value, and resuming
    // from mid-wave made a quick second navigation look like no animation.
    fill.set(0);
    drain.set(0);

    const docking = animate(dock, home ? 0 : 1, { duration: DOCK_DURATION, ease: EASE });
    const shifting = animate(aside, asideTarget, { duration: DOCK_DURATION, ease: EASE });
    const centring = animate(centred, centredTarget, { duration: DOCK_DURATION, ease: EASE });

    let wipe: ReturnType<typeof animate> | null = null;
    const wave = animate(fill, 1, {
      duration: FILL_DURATION,
      ease: "easeOut",
      onComplete: () => {
        wipe = animate(drain, 1, {
          duration: DRAIN_DURATION,
          ease: "linear",
          // Rings must go before the front that emptied them, or restoring
          // their opacity shows as a flash.
          onComplete: () => {
            fill.set(0);
            drain.set(0);
          },
        });
      },
    });

    return () => {
      docking.stop();
      shifting.stop();
      centring.stop();
      wave.stop();
      wipe?.stop();
    };
  }, [pathname, fill, drain, dock, aside, centred, reduced]);

  // Satellites arriving via navigation wait out the wave's fill; a click on
  // the iris brings them out immediately.
  const lastPath = useRef(pathname);
  useEffect(() => {
    const navigated = lastPath.current !== pathname;
    lastPath.current = pathname;

    if (reduced) {
      spread.set(open ? 1 : 0);
      orbitSpin.set(0);
      return;
    }

    const options = open
      ? { duration: ORBIT_ENTER, ease: EASE, delay: navigated ? FILL_DURATION : 0 }
      : { duration: ORBIT_EXIT, ease: "easeIn" as const };
    const anims = [
      animate(spread, open ? 1 : 0, options),
      animate(orbitSpin, open ? 0 : ORBIT_SPIN, options),
    ];
    return () => anims.forEach((a) => a.stop());
  }, [open, pathname, spread, orbitSpin, reduced]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") toggle();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, toggle]);

  // Before measurement (server render, first paint) fall back to CSS sizes so
  // a docked route never flashes a full-size eye over its content.
  const eyeSize = useTransform(dock, (d) =>
    homeSize === null ? (d >= 0.5 ? `${dockSize}px` : "78vmin") : `${mix(homeSize, dockSize, d)}px`,
  );

  // On mobile the docked iris sits at the bottom, lifting when open so the
  // whole ring stays on screen.
  const dockY = useTransform([dock, spread, centred], ([d, s, c]: number[]) => {
    if (!isNarrow || viewportHeight === null) return 0;
    const clearance = mix(dockSize / 2, dockRadius + dockIcon, s);
    return d * (1 - c) * (viewportHeight / 2 - DOCK_MARGIN - clearance);
  });

  const dockX = useTransform([aside, spread], ([a, s]: number[]) => {
    if (viewportWidth === null) return 0;
    const clearance = mix(dockSize / 2, dockRadius + dockIcon, s);
    const edge = Math.max(0, viewportWidth / 2 - DOCK_MARGIN - clearance);
    return -a * (isNarrow ? edge : Math.min(edge, viewportWidth * ASIDE_SHIFT));
  });
  const dockOffsets = useMemo(() => [dockX, dockY], [dockX, dockY]);

  const orbitRadius = useTransform([dock, spread], ([d, s]: number[]) => mix(homeRadius, dockRadius, d) * s);
  const orbitIconSize = useTransform(dock, (d) => mix(homeIcon, dockIcon, d));

  // Publish the iris's footprint so page text can flow around it.
  useEffect(() => {
    if (isHome || viewportWidth === null || viewportHeight === null) {
      setIrisObstacle(null);
      return;
    }
    const publish = () => {
      const d = dock.get();
      const size = homeSize === null ? dockSize : mix(homeSize, dockSize, d);
      const eye = (size * CORE_OUTER) / EYE_VIEWBOX;
      const ring = (mix(homeRadius, dockRadius, d) + mix(homeIcon, dockIcon, d) / 2) * spread.get();
      setIrisObstacle({
        x: viewportWidth / 2 + dockX.get(),
        y: viewportHeight / 2 + dockY.get(),
        r: Math.max(eye, ring),
      });
    };
    publish();
    const unsubscribes = [dock, spread, dockX, dockY].map((value) => value.on("change", publish));
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [isHome, viewportWidth, viewportHeight, homeSize, dockSize, homeRadius, dockRadius, homeIcon, dockIcon, dock, spread, dockX, dockY]);

  const eyeParams = HOME_EYE;

  // The eye shrinks while the wave plays, so the wave is scaled up in viewBox
  // units to keep the same on-screen spacing at any eye size.
  const unitsPerPx = containerWidth ? EYE_VIEWBOX / containerWidth : 0;
  const pxScale = homeSize && containerWidth ? homeSize / containerWidth : 1;
  const waveSpacing = WAVE_SPACING * pxScale;
  const waveStart = CORE_OUTER + waveSpacing;
  const reachPx =
    viewportWidth && viewportHeight
      ? isNarrow && !isHome
        ? Math.hypot(viewportWidth / 2, viewportHeight)
        : 0.5 * Math.hypot(viewportWidth, viewportHeight)
      : 0;
  const waveRings = Math.max(
    MIN_WAVE_RINGS,
    Math.ceil((reachPx * unitsPerPx - waveStart) / waveSpacing) + 1,
  );

  const waveParams = {
    pupil: waveStart,
    spacing: waveSpacing,
    count: fillT * waveRings,
    stroke: WAVE_STROKE * pxScale,
    birthFade: RING_BIRTH_FADE,
  };

  // The front has to overrun the outermost ring by its own edge width, or the
  // wipe ends with that ring still partly drawn.
  const innerFade = drainT * (waveRings + 2);

  const travel = maxPupilOffset(eyeParams.spacing, eyeParams.stroke);

  const { gx, gy } = useGaze(eyeContainerRef, dockOffsets);
  const pupilX = useTransform(gx, (v) => v * travel);
  const pupilY = useTransform(gy, (v) => v * travel);
  const ringX = useTransform(gx, (v) => v * travel * 0.35);
  const ringY = useTransform(gy, (v) => v * travel * 0.35);

  // Satellites counter-move against the pointer to sit on their own plane.
  // Off on touch, and faded out as the eye docks.
  const orbitLayer = useParallax(px, py, isNarrow ? 0 : -travel * 0.8);
  const orbitX = useTransform([orbitLayer.x, dock], ([x, d]: number[]) => x * (1 - d));
  const orbitY = useTransform([orbitLayer.y, dock], ([y, d]: number[]) => y * (1 - d));

  const orbitAngle = useTransform([rotation, orbitSpin], ([r, spin]: number[]) => r + spin);

  const items = isHome ? NODES : [...NODES, HOME_NODE];

  return (
    <div className="relative min-h-screen text-brand-dark dark:text-brand-white">
      {maintenanceBanner}
      <div
        ref={viewportRef}
        className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
      >
        <motion.div
          ref={eyeContainerRef}
          className="pointer-events-auto relative"
          style={{
            width: eyeSize,
            height: eyeSize,
            x: dockX,
            y: dockY,
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
            blink={blink}
            className="h-full w-full"
          />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={orbitId}
            aria-label={open ? "Hide sections" : "Show sections"}
            className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
          />
          <motion.div
            className="pointer-events-none absolute inset-0"
            style={{ x: orbitX, y: orbitY, opacity: spread }}
          >
            {homeSize !== null && (
              <Orbit
                id={orbitId}
                items={items}
                radius={orbitRadius}
                iconSize={orbitIconSize}
                rotation={orbitAngle}
                open={open}
                onNavigate={resetToggle}
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      <div className="fixed bottom-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {isHome ? (
        children
      ) : (
        <main className="relative z-10 mx-auto min-h-screen w-full max-w-5xl px-6 pb-40 pt-16 sm:px-10 sm:pb-24">
          {children}
        </main>
      )}
    </div>
  );
}
