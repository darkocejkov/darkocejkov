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

  useEffect(() => {
    if (reduced) {
      bloom.set(0);
      return;
    }
    const controls = animate(bloom, [0, 1, 0], {
      duration: 2.2,
      times: [0, 0.45, 1],
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [pathname, bloom, reduced]);

  // Only the ring count animates. Spacing and stroke stay constant, so the
  // rings keep a uniform weight and an even gap and simply march outward —
  // no taper, no crowding. Ring k sits at pupil + spacing * k, so the
  // outermost reaches 46 + 40 * 11 = 486 units at full bloom, roughly five
  // times the resting eye's extent. The SVG is overflow:visible, so it spills
  // past its box rather than being clipped.
  const eyeParams = {
    pupil: HOME_EYE.pupil,
    spacing: HOME_EYE.spacing,
    count: HOME_EYE.count + bloomT * 10,
    stroke: HOME_EYE.stroke,
  };

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

  // The satellites counter-move against the pointer. Moving them *with* the
  // pupil, only further, made them read as welded to the iris; opposing it
  // puts them on their own plane in front of the eye, which is what separates
  // the two. Disabled on touch: there is no hovering cursor to cue depth
  // from, and on mobile the rotary drag is the only pointer motion — feeding
  // it here displaces the snapped dot off the selector by several pixels.
  const orbitLayer = useParallax(px, py, isNarrow ? 0 : -travel * 0.8);

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
          <Eye
            params={eyeParams}
            size={320}
            pupilX={pupilX}
            pupilY={pupilY}
            ringX={ringX}
            ringY={ringY}
            className="h-full w-full"
          />
          {/* motion.div, not div: reading a motion value with .get() inside a
              style object would sample it once at render and never update. */}
          <motion.div className="absolute inset-0" style={{ x: orbitLayer.x, y: orbitLayer.y }}>
            {containerWidth !== null && (
              <Orbit
                radius={orbitRadius}
                dotSize={orbitDot}
                rotation={rotaryLive ? rotation : undefined}
              />
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
