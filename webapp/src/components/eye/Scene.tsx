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
        inert={!isHome}
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
