"use client";

import { useEffect, useMemo, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { getIrisObstacle } from "@/components/eye/irisObstacle";
import { faceFront, fibonacciSphere, nearestAngle, perspective, rotate } from "./sphere";

export interface SphereBookmark {
  slug: string;
  title: string;
  url: string;
  tags: string[];
}

const DOT_COUNT = 280;
/** Eye distance from the sphere's centre, in radii. */
const DISTANCE = 2.6;
/** Radians per second. */
const AUTO_SPIN = 0.14;
const DRAG_SPEED = 0.006;
const FRICTION = 0.94;
/** A focused bookmark turns to just right of front, so the iris doesn't cover it. */
const FOCUS_OFFSET = 0.55;
/** Pointer travel that turns a press into a drag rather than a click. */
const DRAG_THRESHOLD = 5;

export default function BookmarkSphere({ items }: { items: SphereBookmark[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const control = useRef({
    paused: false,
    target: null as { yaw: number; pitch: number } | null,
  });
  const points = useMemo(() => fibonacciSphere(items.length), [items.length]);
  const focusHandler = useRef<((index: number) => void) | null>(null);
  const reduced = useReducedMotion() ?? false;

  useEffect(() => {
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dots = fibonacciSphere(DOT_COUNT);
    const state = { yaw: 0.4, pitch: -0.3, vYaw: 0, vPitch: 0 };
    let width = 0;
    let height = 0;
    let dpr = 1;

    function resize() {
      const rect = stage.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);

    // Drag to spin, with momentum on release.
    let drag: { x: number; y: number; travel: number; id: number } | null = null;
    let suppressClick = false;

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, travel: 0, id: e.pointerId };
      suppressClick = false;
      control.current.target = null;
    }
    function onPointerMove(e: PointerEvent) {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.travel += Math.hypot(dx, dy);
      drag.x = e.clientX;
      drag.y = e.clientY;
      if (drag.travel < DRAG_THRESHOLD) return;
      if (!stage.hasPointerCapture(e.pointerId)) stage.setPointerCapture(e.pointerId);
      suppressClick = true;
      state.vYaw = -dx * DRAG_SPEED;
      state.vPitch = dy * DRAG_SPEED;
      state.yaw += state.vYaw;
      state.pitch += state.vPitch;
    }
    function onPointerUp(e: PointerEvent) {
      if (drag && e.pointerId === drag.id) drag = null;
    }
    // A drag that ends over a bookmark must not open it.
    function onClickCapture(e: MouseEvent) {
      if (!suppressClick) return;
      e.preventDefault();
      e.stopPropagation();
      suppressClick = false;
    }

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    stage.addEventListener("click", onClickCapture, true);

    let frame = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { target, paused } = control.current;

      if (target) {
        state.yaw += (target.yaw - state.yaw) * 0.12;
        state.pitch += (target.pitch - state.pitch) * 0.12;
        state.vYaw = 0;
        state.vPitch = 0;
      } else if (!drag) {
        state.yaw += state.vYaw;
        state.pitch += state.vPitch;
        state.vYaw *= FRICTION;
        state.vPitch *= FRICTION;
        if (!paused && !reduced) state.yaw += AUTO_SPIN * dt;
      }
      // Ease back toward a gentle tilt so the sphere never ends up upside down.
      if (!drag && !target) state.pitch += (-0.3 - state.pitch) * 0.01;

      const iris = getIrisObstacle();
      const cx = iris?.x ?? width / 2;
      const cy = iris?.y ?? height / 2;
      const fit = Math.min(width, height) * (width < 640 ? 0.4 : 0.36);
      const radius = Math.max(fit, (iris?.r ?? 56) + 80);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = getComputedStyle(stage).color;
      for (const dot of dots) {
        const q = rotate(dot, state.yaw, state.pitch);
        const s = perspective(q.z, DISTANCE);
        ctx.globalAlpha = 0.08 + 0.5 * ((q.z + 1) / 2) ** 2;
        ctx.beginPath();
        ctx.arc(cx + q.x * radius * s, cy + q.y * radius * s, 1.5 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      points.forEach((point, i) => {
        const el = labelRefs.current[i];
        if (!el) return;
        const q = rotate(point, state.yaw, state.pitch);
        const s = perspective(q.z, DISTANCE);
        const depth = (q.z + 1) / 2;
        el.style.transform = `translate(${cx + q.x * radius * s}px, ${cy + q.y * radius * s}px) translate(-50%, -50%) scale(${s.toFixed(3)})`;
        el.style.opacity = (0.12 + 0.88 * depth ** 1.6).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
        el.style.pointerEvents = q.z > -0.25 ? "auto" : "none";
      });

      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);

    function focusOn(index: number) {
      const front = faceFront(points[index]);
      control.current.target = {
        yaw: nearestAngle(state.yaw, front.yaw - FOCUS_OFFSET),
        pitch: front.pitch,
      };
    }
    focusHandler.current = focusOn;

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      stage.removeEventListener("click", onClickCapture, true);
      focusHandler.current = null;
    };
  }, [reduced, points]);

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 touch-none select-none overflow-hidden text-brand-dark dark:text-brand-white"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
      <ul aria-label="bookmarks">
        {items.map((item, i) => (
          <li key={item.slug}>
            <a
              ref={(el) => {
                labelRefs.current[i] = el;
              }}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              draggable={false}
              onPointerEnter={() => (control.current.paused = true)}
              onPointerLeave={() => (control.current.paused = false)}
              onFocus={() => focusHandler.current?.(i)}
              onBlur={() => (control.current.target = null)}
              className="group absolute left-0 top-0 flex flex-col items-center whitespace-nowrap rounded-sm px-2 py-1 text-center opacity-0 outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-brand-orange"
            >
              <span className="font-funnel text-lg font-extrabold leading-none tracking-tight transition-colors group-hover:text-brand-orange sm:text-2xl">
                {item.title}
              </span>
              {item.tags.length > 0 && (
                <span className="mt-1 font-mono text-[10px] lowercase text-gray-500 sm:text-xs">
                  {item.tags.join(" · ")}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
