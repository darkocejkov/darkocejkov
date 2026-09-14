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
  const { rotation, bind } = useRotary(NODES.length);
  const rotaryBind = isNarrow ? bind : {};

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
        ? (isNarrow ? nearestNodeIndex(rotation.get(), NODES.length) : -1)
        : nodeIndexForPath(pathname),
    );
  }, [pathname, setPhase, setActiveNode, isNarrow, rotation]);

  // Ring count blooms 2 -> 8 -> 2 on every navigation. Held in a motion value so
  // the tween itself is frame-driven; mirrored into state only because
  // ringGeometry runs at render time.
  const bloom = useMotionValue(0);
  const [bloomT, setBloomT] = useState(0);
  useMotionValueEvent(bloom, "change", setBloomT);

  useEffect(() => {
    if (reduced) {
      bloom.set(0);
      return;
    }
    const controls = animate(bloom, [0, 1, 0], {
      duration: 0.9,
      times: [0, 0.45, 1],
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [pathname, bloom, reduced]);

  const eyeParams = {
    pupil: HOME_EYE.pupil,
    spacing: HOME_EYE.spacing - bloomT * 22,
    count: HOME_EYE.count + bloomT * 6,
    stroke: HOME_EYE.stroke - bloomT * 18,
  };

  // Pupil travel is bounded so it can never cross its ring.
  const travel = maxPupilOffset(eyeParams.spacing, eyeParams.stroke);
  const pupilX = useTransform(px, (v) => v * travel);
  const pupilY = useTransform(py, (v) => v * travel);

  // Outer layers move less than the pupil — nearer things move more. Disabled
  // on touch: there is no hovering cursor to cue depth from, and on mobile the
  // rotary drag itself is the only pointer motion — feeding it into this
  // layer displaces the snapped dot off the selector by several pixels.
  const orbitLayer = useParallax(px, py, isNarrow ? 0 : travel * 1.6);

  const isHome = pathname === "/";

  return (
    <div className="relative min-h-screen text-brand-dark dark:text-brand-white">
      {maintenanceBanner}
      <div
        className={[
          "pointer-events-none fixed inset-0 z-0 flex items-center justify-center",
          "transition-opacity duration-500",
          isHome ? "opacity-100" : "opacity-0",
        ].join(" ")}
        inert={!isHome}
      >
        <div
          ref={eyeContainerRef}
          className="pointer-events-auto relative"
          style={{
            width: "78vmin",
            height: "78vmin",
            touchAction: isNarrow && isHome ? "none" : undefined,
          }}
          {...rotaryBind}
        >
          <Eye params={eyeParams} size={320} pupilX={pupilX} pupilY={pupilY} className="h-full w-full" />
          {/* motion.div, not div: reading a motion value with .get() inside a
              style object would sample it once at render and never update. */}
          <motion.div className="absolute inset-0" style={{ x: orbitLayer.x, y: orbitLayer.y }}>
            {containerWidth !== null && (
              <Orbit radius={orbitRadius} dotSize={orbitDot} rotation={isNarrow ? rotation : undefined} />
            )}
          </motion.div>
        </div>
      </div>

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
