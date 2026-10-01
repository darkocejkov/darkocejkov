"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { registerFlow } from "./engine";

/** An MDX paragraph whose text flows around the iris. */
export function FlowParagraph({ children, ...props }: ComponentProps<"p">) {
  const root = useRef<HTMLParagraphElement>(null);
  const source = useRef<HTMLSpanElement>(null);
  const lines = useRef<HTMLSpanElement>(null);

  useEffect(() => registerFlow(root.current!, source.current!, lines.current!, null), []);

  return (
    <p {...props} ref={root}>
      <span ref={source}>{children}</span>
      <span ref={lines} className="relative block" />
    </p>
  );
}

/** A display-size page title that flows around the iris. */
export function FlowTitle({ children, className, ...props }: ComponentProps<"h1">) {
  const root = useRef<HTMLHeadingElement>(null);
  const source = useRef<HTMLSpanElement>(null);
  const lines = useRef<HTMLSpanElement>(null);

  useEffect(() => registerFlow(root.current!, source.current!, lines.current!, null), []);

  return (
    <h1 {...props} ref={root} className={["title-display", className].filter(Boolean).join(" ")}>
      <span ref={source}>{children}</span>
      <span ref={lines} className="relative block" />
    </h1>
  );
}

/** An MDX list item whose text flows around the iris, marker included. */
export function FlowListItem({ children, ...props }: ComponentProps<"li">) {
  const root = useRef<HTMLLIElement>(null);
  const source = useRef<HTMLDivElement>(null);
  const lines = useRef<HTMLDivElement>(null);

  useEffect(() => registerFlow(root.current!, source.current!, lines.current!, root.current), []);

  return (
    <li {...props} ref={root}>
      <div ref={source}>{children}</div>
      <div ref={lines} className="relative" />
    </li>
  );
}
