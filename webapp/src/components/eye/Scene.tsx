"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "motion/react";
import Eye from "./Eye";
import Orbit from "./Orbit";
import Rail from "./Rail";
import { useParallax, usePointer } from "./usePointer";
import { nodeIndexForPath } from "@/config/nodes";
import { maxPupilOffset } from "@/lib/orbit";
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
  const { px, py } = usePointer();
  const setPhase = useSceneStore((s) => s.setPhase);
  const setActiveNode = useSceneStore((s) => s.setActiveNode);

  useEffect(() => {
    const home = pathname === "/";
    setPhase(home ? "home" : "docked");
    // On "/" the rotary owns activeNode. Writing here would run after the
    // rotary's own mount effect and reset the selection to -1.
    if (!home) setActiveNode(nodeIndexForPath(pathname));
  }, [pathname, setPhase, setActiveNode]);

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

  // Outer layers move less than the pupil — nearer things move more.
  const orbitLayer = useParallax(px, py, travel * 1.6);

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
          className="pointer-events-auto relative"
          style={{ width: "min(70vmin, 520px)", height: "min(70vmin, 520px)" }}
        >
          <Eye params={eyeParams} size={320} pupilX={pupilX} pupilY={pupilY} className="h-full w-full" />
          {/* motion.div, not div: reading a motion value with .get() inside a
              style object would sample it once at render and never update. */}
          <motion.div className="absolute inset-0" style={{ x: orbitLayer.x, y: orbitLayer.y }}>
            <Orbit radius={210} dotSize={22} />
          </motion.div>
        </div>
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
