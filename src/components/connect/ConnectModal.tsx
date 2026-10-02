"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { isContactEmail } from "@/lib/contact";

/** How far the modal sinks at the bottom of a bob; its shadow stays put, so the gap closes. */
const BOB = 10;
const SHADOW = { x: 12, y: 26 };

export default function ConnectModal({
  size,
  onDismiss,
  onSent,
}: {
  size: number;
  onDismiss: () => void;
  onSent: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const valid = isContactEmail(email);

  const scale = useMotionValue(reduced ? 1 : 0);
  const rollX = useMotionValue(0);
  // Rolling without slipping: travel = radius × angle.
  const rotate = useTransform(rollX, (x) => (x / (size / 2)) * (180 / Math.PI));

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
    if (reduced) return;
    const entering = animate(scale, 1, { type: "spring", stiffness: 210, damping: 17 });
    return () => entering.stop();
  }, [scale, reduced]);

  const dismiss = useCallback(async () => {
    if (!reduced) await animate(scale, 0, { duration: 0.22, ease: "easeIn" });
    onDismiss();
  }, [scale, reduced, onDismiss]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") void dismiss();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismiss]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!valid || sending) return;
    const website = new FormData(e.currentTarget).get("website");

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), website: typeof website === "string" ? website : "" }),
      });
      if (!res.ok) {
        const body: unknown = await res.json().catch(() => null);
        const message =
          body && typeof body === "object" && "error" in body && typeof body.error === "string"
            ? body.error
            : "couldn't send. try again?";
        throw new Error(message);
      }
    } catch (err) {
      setSending(false);
      setError(err instanceof TypeError ? "couldn't reach the server. try again?" : (err as Error).message);
      return;
    }

    if (reduced) {
      await animate(scale, 0, { duration: 0.2 });
    } else {
      await animate(rollX, window.innerWidth / 2 + size, { duration: 1.2, ease: [0.5, 0, 0.75, 0.2] });
    }
    onSent();
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[65] flex items-center justify-center"
      onPointerDown={(e) => {
        if (e.target === e.currentTarget && !sending) void dismiss();
      }}
    >
      <motion.div className="relative" style={{ width: size, height: size, x: rollX, scale }}>
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-black/15 dark:bg-black/45"
          style={{ transform: `translate(${SHADOW.x}px, ${SHADOW.y}px)` }}
        />
        <motion.div
          className="h-full w-full"
          animate={reduced ? undefined : { y: [0, BOB, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            role="dialog"
            aria-label="leave your email"
            className="relative h-full w-full rounded-full border-brand-dark bg-brand-white text-brand-dark dark:border-brand-white dark:bg-brand-dark dark:text-brand-white"
            style={{ rotate, borderWidth: Math.round(size * 0.045) }}
          >
            <form onSubmit={onSubmit} className="flex h-full w-full items-center justify-center px-[9%]">
              <label htmlFor="connect-email" className="sr-only">
                email
              </label>
              <input
                ref={input}
                id="connect-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                required
                placeholder="what's your email?"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "connect-error" : undefined}
                className="w-full min-w-0 bg-transparent px-8 text-center text-base caret-brand-cyan outline-none placeholder:text-gray-400 sm:px-9 sm:text-xl"
              />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />
              <button
                type="submit"
                aria-label="send"
                disabled={!valid || sending}
                className="absolute right-[8%] rounded-full p-1 outline-none transition-opacity duration-200 focus-visible:ring-2 focus-visible:ring-brand-orange disabled:pointer-events-none disabled:opacity-0"
              >
                <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12h15M13 5.5 19.5 12 13 18.5" />
                </svg>
              </button>
            </form>
            {error && (
              <p
                id="connect-error"
                role="alert"
                className="absolute inset-x-[18%] bottom-[24%] text-center text-xs text-brand-red"
              >
                {error}
              </p>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>,
    document.body,
  );
}
