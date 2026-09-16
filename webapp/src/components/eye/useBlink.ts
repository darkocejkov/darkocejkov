"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMotionValue, useReducedMotion } from "motion/react";

/**
 * The blink, as discrete frames rather than a tween. Each value is how far
 * shut the lid is, held for FRAME_MS and then cut to the next — so it reads as
 * stop-motion, in the same spirit as the frames it was drawn from, instead of
 * sweeping smoothly closed.
 */
const FRAMES = [0.25, 0.5, 0.75, 0.5, 0.25, 0];
/** Milliseconds each frame is held. */
const FRAME_MS = 55;

/** Shortest and longest gap between unprompted blinks, in seconds. */
const IDLE_MIN = 3.2;
const IDLE_MAX = 8.5;

/** Ignore a prompt arriving while a blink is already running. */
const REFRACTORY = FRAMES.length * FRAME_MS;

/**
 * Drives the eyelid. Returns a value from 0 (open) to 1 (shut) for the mask to
 * follow, and a `trigger` to prompt a blink by hand.
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
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearFrames = useCallback(() => {
    frameTimers.current.forEach(clearTimeout);
    frameTimers.current = [];
  }, []);

  const trigger = useCallback(() => {
    if (reduced) return;
    const now = Date.now();
    if (now < busyUntil.current) return;
    busyUntil.current = now + REFRACTORY;

    clearFrames();
    // One timer per frame rather than an interval: a dropped tick then costs
    // that frame alone instead of shifting every frame after it.
    FRAMES.forEach((value, i) => {
      frameTimers.current.push(setTimeout(() => blinkValue.set(value), i * FRAME_MS));
    });
  }, [blinkValue, reduced, clearFrames]);

  useEffect(() => {
    if (reduced) {
      blinkValue.set(0);
      return;
    }

    // Each gap is drawn as it is scheduled rather than from a fixed interval,
    // so the rhythm never settles into one the eye can predict.
    const schedule = () => {
      const wait = (IDLE_MIN + Math.random() * (IDLE_MAX - IDLE_MIN)) * 1000;
      idleTimer.current = setTimeout(() => {
        trigger();
        schedule();
      }, wait);
    };
    schedule();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      clearFrames();
    };
  }, [trigger, blinkValue, reduced, clearFrames]);

  return { blink: blinkValue, trigger };
}
