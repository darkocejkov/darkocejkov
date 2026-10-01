"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useMediaQuery } from "@/components/eye/useMediaQuery";

const TEXT = "looking for work";

/** Degrees of rotation per pixel the pointer travels. */
const SPIN_PER_PX = 0.45;

// Radius clears the 32px cursor, which extends down-right from its top-left hotspot.
const CURSOR_SIZE = 130;
const CURSOR_RADIUS = 46;

const CORNER_SIZE = 180;
const CORNER_RADIUS = 66;

/** Closed circle path starting at 9 o'clock, so text runs clockwise over the top. */
const circlePath = (c: number, r: number) =>
  `M ${c - r},${c} a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 ${-2 * r},0`;

function CursorRing() {
  const reduced = useReducedMotion() ?? false;
  const x = useMotionValue(-CURSOR_SIZE);
  const y = useMotionValue(-CURSOR_SIZE);
  const opacity = useMotionValue(0);
  const spin = useMotionValue(0);
  const rotate = useSpring(spin, { stiffness: 60, damping: 18, mass: 0.8 });

  useEffect(() => {
    let lastX: number | null = null;
    let lastY = 0;

    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX - CURSOR_SIZE / 2);
      y.set(e.clientY - CURSOR_SIZE / 2);
      opacity.set(1);
      if (lastX !== null && !reduced) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        // Speed sets how far it turns; horizontal direction sets which way.
        spin.set(spin.get() + Math.hypot(dx, dy) * Math.sign(dx || dy) * SPIN_PER_PX);
      }
      lastX = e.clientX;
      lastY = e.clientY;
    }

    function onLeave() {
      opacity.set(0);
      lastX = null;
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [x, y, opacity, spin, reduced]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[70]"
      style={{ x, y, opacity, width: CURSOR_SIZE, height: CURSOR_SIZE }}
    >
      <motion.svg
        viewBox={`0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}`}
        className="h-full w-full overflow-visible"
        style={{ rotate }}
      >
        <path id="lfw-cursor-path" d={circlePath(CURSOR_SIZE / 2, CURSOR_RADIUS)} fill="none" />
        <text className="fill-current text-[13px] tracking-wide">
          <textPath href="#lfw-cursor-path">{TEXT}</textPath>
        </text>
      </motion.svg>
    </motion.div>
  );
}

function CornerMarquee() {
  const circumference = 2 * Math.PI * CORNER_RADIUS;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[70]"
      style={{
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        left: -CORNER_SIZE * 0.4,
        bottom: -CORNER_SIZE * 0.4,
      }}
    >
      <svg
        viewBox={`0 0 ${CORNER_SIZE} ${CORNER_SIZE}`}
        className="h-full w-full animate-[spin_24s_linear_infinite] motion-reduce:animate-none"
      >
        <path id="lfw-corner-path" d={circlePath(CORNER_SIZE / 2, CORNER_RADIUS)} fill="none" />
        <text className="fill-current text-[14px]">
          <textPath href="#lfw-corner-path" textLength={circumference} lengthAdjust="spacing">
            {`${TEXT} · ${TEXT} · `}
          </textPath>
        </text>
      </svg>
    </div>
  );
}

/** Availability indicator: orbits the cursor on mouse devices, spins in the corner on touch. */
export default function LookingForWork() {
  const hasMouse = useMediaQuery("(hover: hover) and (pointer: fine)");
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)");
  return (
    <>
      <p className="sr-only" role="status">
        {TEXT}
      </p>
      {hasMouse ? <CursorRing /> : isTouch ? <CornerMarquee /> : null}
    </>
  );
}
