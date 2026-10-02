"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useElementSize } from "@/components/eye/useElementSize";
import ConnectModal from "./ConnectModal";

/** Rest heights of the plug and socket, as fractions of the viewport height. */
const PLUG_REST = 0.32;
const SOCKET_REST = 0.7;
/** Where the joined pair settles. */
const MEET = 0.5;

const SOCKET_SCALE = 1.18;
/** Centre-to-centre distance, in socket widths, that counts as plugged in. */
const SNAP_DISTANCE = 0.9;
/** Cables are anchored this many viewport heights off-screen, so they stay near vertical and never kink. */
const ANCHOR_REACH = 1;

const SNAP = { type: "spring", stiffness: 520, damping: 30 } as const;
const RETURN = { type: "spring", stiffness: 260, damping: 18 } as const;

const RING_COUNT = 4;
const MODAL_DELAY_MS = 900;

const wireWidth = (stageWidth: number) => Math.min(150, Math.max(80, stageWidth * 0.11));

const circlePath = (c: number, r: number) =>
  `M ${c - r},${c} a ${r},${r} 0 1,1 ${2 * r},0 a ${r},${r} 0 1,1 ${-2 * r},0`;

/** A straight cable from an off-screen anchor, with the head turned to follow it. */
function useWire(stageW: MotionValue<number>, stageH: MotionValue<number>, rest: number, fromTop: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const geometry = ([dx, dy, w, h]: number[]) => {
    const anchorY = fromTop ? -h * ANCHOR_REACH : h * (1 + ANCHOR_REACH);
    return { ax: w / 2, ay: anchorY, hx: w / 2 + dx, hy: h * rest + dy };
  };

  const path = useTransform([x, y, stageW, stageH], (values: number[]) => {
    const { ax, ay, hx, hy } = geometry(values);
    return `M ${ax},${ay} L ${hx},${hy}`;
  });

  // Turns the head's cable side to face the anchor.
  const rotate = useTransform([x, y, stageW, stageH], (values: number[]) => {
    const { ax, ay, hx, hy } = geometry(values);
    const [vx, vy] = [hx - ax, hy - ay];
    return (fromTop ? Math.atan2(-vx, vy) : Math.atan2(vx, -vy)) * (180 / Math.PI);
  });

  return { x, y, path, rotate };
}

export default function Wires() {
  const reduced = useReducedMotion() ?? false;
  const { ref: stageRef, width, height } = useElementSize<HTMLDivElement>();
  const [connected, setConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [pulse, setPulse] = useState(0);
  const dragged = useRef(false);
  const modalTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stageW = useMotionValue(0);
  const stageH = useMotionValue(0);
  useEffect(() => {
    stageW.set(width ?? 0);
    stageH.set(height ?? 0);
  }, [width, height, stageW, stageH]);

  useEffect(() => () => clearTimeout(modalTimer.current ?? undefined), []);

  const plug = useWire(stageW, stageH, PLUG_REST, true);
  const socket = useWire(stageW, stageH, SOCKET_REST, false);

  const w = wireWidth(width ?? 0);
  const s = w * SOCKET_SCALE;

  function settle(join: boolean) {
    const h = height ?? 0;
    const targets: [MotionValue<number>, number][] = [
      [plug.x, 0],
      [plug.y, join ? h * (MEET - PLUG_REST) : 0],
      [socket.x, 0],
      [socket.y, join ? h * (MEET - SOCKET_REST) : 0],
    ];
    for (const [value, target] of targets) {
      if (reduced) value.set(target);
      else animate(value, target, join ? SNAP : RETURN);
    }

    setConnected(join);
    clearTimeout(modalTimer.current ?? undefined);
    if (!join) {
      setModalOpen(false);
      return;
    }
    setPulse((n) => n + 1);
    navigator.vibrate?.(12);
    if (!sent) modalTimer.current = setTimeout(() => setModalOpen(true), reduced ? 0 : MODAL_DELAY_MS);
  }

  function onDragStart() {
    dragged.current = true;
    clearTimeout(modalTimer.current ?? undefined);
    setConnected(false);
    setModalOpen(false);
  }

  function onDragEnd() {
    const h = height ?? 0;
    const gap = Math.hypot(
      plug.x.get() - socket.x.get(),
      h * PLUG_REST + plug.y.get() - (h * SOCKET_REST + socket.y.get()),
    );
    settle(gap < s * SNAP_DISTANCE);
  }

  // A click (or Enter/Space) toggles the connection; a drag that ends on the
  // button must not also count as one.
  function onClick() {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    settle(!connected);
  }

  const ready = width !== null && height !== null;
  const cx = (width ?? 0) / 2;
  const plugRestY = (height ?? 0) * PLUG_REST;
  const meetY = (height ?? 0) * MEET;

  // Glyphs sit outside the arc, so leave room for their height at the edge.
  const arcRadius = Math.max(0, Math.min(w * 1.9, cx - 40));
  const arcPoint = (angle: number) =>
    `${cx + arcRadius * Math.cos(angle)},${plugRestY + arcRadius * Math.sin(angle)}`;
  // Start the arc low enough that its first glyphs stay on screen.
  const arcStart = -Math.min(1.12, Math.asin(Math.min(1, Math.max(0, plugRestY - 36) / (arcRadius || 1))));

  const spinRadius = s * 0.95;
  const spinBox = 2 * (spinRadius + 24);
  const spinText = sent ? "talk soon · " : "connected · ";
  const modalSize = Math.min((width ?? 0) * 0.86, (height ?? 0) * 0.78, 520);

  const button =
    "absolute touch-none bg-current outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-brand-white dark:focus-visible:ring-offset-brand-dark";
  const ringStroke = "stroke-brand-white transition-[stroke,opacity] duration-300 dark:stroke-brand-dark";

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 select-none overflow-hidden text-brand-dark dark:text-brand-white"
    >
      {ready && (
        <>
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <path id="connect-arc" fill="none" d={`M ${arcPoint(arcStart)} A ${arcRadius},${arcRadius} 0 0,1 ${arcPoint(arcStart + 1.37)}`} />
            <text
              className={`fill-current text-[clamp(1rem,2.4vw,1.75rem)] tracking-wide transition-opacity duration-300 ${connected ? "opacity-0" : ""}`}
            >
              <textPath href="#connect-arc">connect with me</textPath>
            </text>
          </svg>

          {/* Each wire is one layer, cable and head together, so a head never slips under its own cable. */}
          <div className="pointer-events-none absolute inset-0">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              <motion.path d={socket.path} fill="none" stroke="currentColor" strokeWidth={s} />
            </svg>
            <motion.button
              type="button"
              aria-label={connected ? "unplug" : "plug in"}
              aria-pressed={connected}
              drag
              dragConstraints={stageRef}
              dragElastic={0.12}
              dragMomentum={false}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={onClick}
              className={`${button} pointer-events-auto rounded-t-full`}
              style={{ x: socket.x, y: socket.y, rotate: socket.rotate, left: cx - s / 2, top: height * SOCKET_REST - s / 2, width: s, height: s }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full">
                <circle cx="50" cy="50" r="30" fill="none" strokeWidth="9" className={`${ringStroke} ${connected ? "opacity-0" : ""}`} />
              </svg>
            </motion.button>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
              <motion.path d={plug.path} fill="none" stroke="currentColor" strokeWidth={w} />
            </svg>
            <motion.button
              type="button"
              aria-label={connected ? "unplug" : "plug in"}
              aria-pressed={connected}
              drag
              dragConstraints={stageRef}
              dragElastic={0.12}
              dragMomentum={false}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onClick={onClick}
              className={`${button} pointer-events-auto rounded-b-full`}
              style={{ x: plug.x, y: plug.y, rotate: plug.rotate, left: cx - w / 2, top: plugRestY - w / 2, width: w, height: w }}
            >
              <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
                <circle
                  cx="50"
                  cy="50"
                  r="27"
                  fill="none"
                  strokeWidth="11"
                  className={connected ? "stroke-brand-orange transition-[stroke] duration-300" : ringStroke}
                  style={connected ? { filter: "drop-shadow(0 0 6px #FF9F1C)" } : undefined}
                />
              </svg>
            </motion.button>
          </div>

          {connected &&
            !reduced &&
            Array.from({ length: RING_COUNT }, (_, i) => (
              <motion.span
                key={`${pulse}-${i}`}
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full border-[3px] border-brand-orange"
                style={{ left: cx - s / 2, top: meetY - s / 2, width: s, height: s }}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 5, opacity: [0, 0.9, 0] }}
                transition={{ duration: 1.6, delay: i * 0.22, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}

          {connected && (
            <motion.svg
              aria-hidden="true"
              viewBox={`0 0 ${spinBox} ${spinBox}`}
              className="pointer-events-none absolute overflow-visible"
              style={{ left: cx - spinBox / 2, top: meetY - spinBox / 2, width: spinBox, height: spinBox }}
              initial={{ opacity: 0, rotate: -40 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, rotate: [-40, 320] }}
              transition={reduced ? { duration: 0 } : { opacity: { duration: 0.4 }, rotate: { duration: 16, ease: "linear", repeat: Infinity } }}
            >
              <path id="connect-spin" d={circlePath(spinBox / 2, spinRadius)} fill="none" />
              <text className="fill-current text-[13px] tracking-[0.2em]">
                <textPath href="#connect-spin" textLength={2 * Math.PI * spinRadius} lengthAdjust="spacing">
                  {spinText.repeat(Math.max(2, Math.round((2 * Math.PI * spinRadius) / 120)))}
                </textPath>
              </text>
            </motion.svg>
          )}

          <p
            aria-hidden={connected}
            className={`pointer-events-none absolute font-mono text-xs leading-snug transition-opacity duration-300 sm:text-sm ${connected ? "opacity-0" : ""}`}
            style={{ left: cx + s / 2 + 16, right: 0, top: height * SOCKET_REST + s * 0.4 }}
          >
            click drag to
            <br />
            connect
          </p>
          <p aria-live="polite" className="sr-only">
            {sent ? "sent. talk soon." : connected ? "connected." : ""}
          </p>

          {modalOpen && modalSize > 0 && (
            <ConnectModal
              size={modalSize}
              onDismiss={() => setModalOpen(false)}
              onSent={() => {
                setSent(true);
                setModalOpen(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
