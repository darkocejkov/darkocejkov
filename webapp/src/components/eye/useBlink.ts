"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

/** Seconds the lid takes to come down. */
const CLOSE = 0.09;
/** Seconds it rests shut. */
const HOLD = 0.04;
/** Seconds the lid takes to lift. Opening slower than closing is what stops a
 *  blink looking like a glitch — real lids snap shut and drift back up. */
const OPEN = 0.16;

/** Shortest and longest gap between unprompted blinks, in seconds. */
const IDLE_MIN = 3.2;
const IDLE_MAX = 8.5;

/** Ignore a prompt arriving while a blink is already running. */
const REFRACTORY = (CLOSE + HOLD + OPEN) * 1000;

/**
 * Drives the eyelid. Returns a value from 0 (open) to 1 (shut) for the mask to
 * follow, and a `blink` to prompt one by hand.
 *
 * Blinks on its own at irregular intervals — a fixed period reads as a
 * metronome rather than something alive, so each gap is drawn fresh.
 *
 * Does nothing under prefers-reduced-motion: an eye that blinks at you is
 * exactly the kind of unprompted movement that setting asks to be spared.
 */
export function useBlink() {
  const blinkValue = useMotionValue(0);
  const reduced = useReducedMotion() ?? false;

  const busyUntil = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const blink = useCallback(() => {
    if (reduced) return;
    const now = Date.now();
    if (now < busyUntil.current) return;
    busyUntil.current = now + REFRACTORY;

    animate(blinkValue, [0, 1, 1, 0], {
      duration: CLOSE + HOLD + OPEN,
      times: [0, CLOSE / (CLOSE + HOLD + OPEN), (CLOSE + HOLD) / (CLOSE + HOLD + OPEN), 1],
      ease: "easeInOut",
    });
  }, [blinkValue, reduced]);

  useEffect(() => {
    if (reduced) {
      blinkValue.set(0);
      return;
    }

    // Each gap is drawn as it is scheduled rather than from a fixed interval,
    // so the rhythm never settles into one the eye can predict.
    const schedule = () => {
      const wait = (IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN)) * 1000;
      timer.current = setTimeout(() => {
        blink();
        schedule();
      }, wait);
    };
    schedule();

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [blink, blinkValue, reduced]);

  return { blink: blinkValue, trigger: blink };
}
