"use client";

import {
  layoutNextRichInlineLineRange,
  materializeRichInlineLineRange,
  prepareRichInline,
  type PreparedRichInline,
  type RichInlineCursor,
  type RichInlineItem,
} from "@chenglou/pretext/rich-inline";
import { getIrisObstacle, subscribeIrisObstacle, type IrisObstacle } from "@/components/eye/irisObstacle";
import { MIN_SLOT_WIDTH, V_PAD, slotsFor } from "./slots";

/** Extra passes allowed for heights above a block to settle after a change. */
const MAX_SETTLE_PASSES = 4;

/** Blocks containing these keep native layout: Pretext only shapes inline text. */
const UNFLOWABLE =
  "img,svg,video,iframe,canvas,input,button,select,textarea,ul,ol,p,div,pre,blockquote,table,hr,h1,h2,h3,h4,h5,h6";

interface Run {
  prepared: PreparedRichInline;
  /** Per item: its inline ancestors inside the source, outermost first. */
  chains: Element[][];
}

interface FlowItem {
  root: HTMLElement;
  source: HTMLElement;
  lines: HTMLElement;
  listItem: HTMLLIElement | null;
  runs: Run[] | null;
  lineHeight: number;
  marker: { text: string; color: string } | null;
  signature: string;
  /** Width of the last layout done clear of the iris; -1 when it wrapped. */
  clearWidth: number;
}

interface PlacedFragment {
  x: number;
  text: string;
  chain: Element[];
}

interface PlacedLine {
  y: number;
  fragments: PlacedFragment[];
}

const items = new Set<FlowItem>();
let frame = 0;
let settlePasses = 0;
let teardown: (() => void) | null = null;

function schedule(fromInput = true) {
  if (fromInput) settlePasses = 0;
  if (!frame) frame = requestAnimationFrame(render);
}

function onResize() {
  items.forEach(prepare);
  schedule();
}

function ensureListeners() {
  if (teardown) return;
  const onScroll = () => schedule();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  const unsubscribe = subscribeIrisObstacle(() => schedule());
  teardown = () => {
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onResize);
    unsubscribe();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };
}

function horizontalInset(chain: Element[]): number {
  let inset = 0;
  for (const el of chain) {
    const s = getComputedStyle(el);
    inset +=
      parseFloat(s.paddingLeft) +
      parseFloat(s.paddingRight) +
      parseFloat(s.borderLeftWidth) +
      parseFloat(s.borderRightWidth);
  }
  return inset;
}

function collectRuns(source: HTMLElement): Run[] | null {
  if (source.querySelector(UNFLOWABLE)) return null;

  const runs: Run[] = [];
  let runItems: RichInlineItem[] = [];
  let chains: Element[][] = [];
  const flush = () => {
    if (runItems.some((item) => item.text.trim())) {
      runs.push({ prepared: prepareRichInline(runItems), chains });
    }
    runItems = [];
    chains = [];
  };

  const walker = document.createTreeWalker(source, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node instanceof HTMLBRElement) {
      flush();
      continue;
    }
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent) continue;

    const parent = node.parentElement!;
    const style = getComputedStyle(parent);
    const chain: Element[] = [];
    for (let el: Element | null = parent; el && el !== source; el = el.parentElement) chain.unshift(el);

    const letterSpacing = parseFloat(style.letterSpacing);
    const extraWidth = horizontalInset(chain);
    runItems.push({
      text: node.textContent,
      font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
      ...(Number.isFinite(letterSpacing) && letterSpacing !== 0 ? { letterSpacing } : {}),
      ...(extraWidth > 0 ? { extraWidth } : {}),
    });
    chains.push(chain);
  }
  flush();
  return runs.length ? runs : null;
}

function listMarker(li: HTMLElement): FlowItem["marker"] {
  const list = li.parentElement;
  if (!list) return null;
  if (list.tagName === "OL") {
    const start = Number((list as HTMLOListElement).start) || 1;
    const index = Array.prototype.indexOf.call(list.children, li);
    return { text: `${start + index}.`, color: "var(--tw-prose-counters)" };
  }
  return { text: "\u2022", color: "var(--tw-prose-bullets)" };
}

function prepare(item: FlowItem) {
  const wasHidden = item.source.hidden;
  item.source.hidden = false;
  const style = getComputedStyle(item.root);
  const lineHeight = parseFloat(style.lineHeight);
  item.lineHeight = Number.isFinite(lineHeight) ? lineHeight : parseFloat(style.fontSize) * 1.2;
  item.runs = collectRuns(item.source);
  item.marker = item.listItem ? listMarker(item.listItem) : null;
  item.signature = "";
  item.clearWidth = -1;
  item.source.hidden = wasHidden && item.runs !== null;
  if (!item.runs) restore(item);
}

function layoutItem(item: FlowItem, rect: DOMRect, obstacle: IrisObstacle | null) {
  const lines: PlacedLine[] = [];
  const lh = item.lineHeight;
  // A band the iris fully blocks is skipped, so cap the empty bands per run.
  const maxEmpty = obstacle ? Math.ceil((obstacle.r * 2) / lh) + 2 : 0;
  let y = 0;

  for (const run of item.runs!) {
    let cursor: RichInlineCursor | undefined;
    let done = false;
    let empty = 0;
    while (!done) {
      const slots = slotsFor(rect.width, rect.top + y, rect.top + y + lh, rect.left, empty > maxEmpty ? null : obstacle);
      if (slots.length === 0) {
        empty++;
        y += lh;
        continue;
      }
      let placed = false;
      for (const slot of slots) {
        const range = layoutNextRichInlineLineRange(run.prepared, slot.right - slot.left, cursor);
        if (range === null) {
          done = true;
          break;
        }
        const line = materializeRichInlineLineRange(run.prepared, range);
        let x = slot.left;
        // Gaps become real spaces so copy-paste and screen readers keep word boundaries.
        const fragments = line.fragments.map((fragment) => {
          const placed = {
            x,
            text: fragment.gapBefore > 0 ? ` ${fragment.text}` : fragment.text,
            chain: run.chains[fragment.itemIndex],
          };
          if (fragment.gapBefore <= 0) placed.x = x + fragment.gapBefore;
          x += fragment.gapBefore + fragment.occupiedWidth;
          return placed;
        });
        const last = fragments[fragments.length - 1];
        if (last && !last.text.endsWith(" ")) last.text += " ";
        lines.push({ y, fragments });
        cursor = range.end;
        placed = true;
      }
      if (!done || placed) y += lh;
    }
  }

  const signature = lines
    .map((line) => `${line.y}:${line.fragments.map((f) => `${Math.round(f.x)}|${f.text}`).join("~")}`)
    .join("\n");
  return { lines, height: y, signature };
}

function buildFragment(fragment: PlacedFragment, y: number, lineHeight: number): HTMLElement {
  const outer = fragment.chain.length
    ? (fragment.chain[0].cloneNode(false) as HTMLElement)
    : document.createElement("span");
  let inner = outer;
  for (let i = 1; i < fragment.chain.length; i++) {
    const clone = fragment.chain[i].cloneNode(false) as HTMLElement;
    inner.appendChild(clone);
    inner = clone;
  }
  inner.textContent = fragment.text;
  outer.removeAttribute("id");
  outer.style.position = "absolute";
  outer.style.left = `${fragment.x}px`;
  outer.style.top = `${y}px`;
  outer.style.lineHeight = `${lineHeight}px`;
  outer.style.whiteSpace = "pre";
  return outer;
}

function write(item: FlowItem, lines: PlacedLine[], height: number) {
  const nodes: HTMLElement[] = [];
  if (item.marker && lines.length) {
    const marker = document.createElement("span");
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = item.marker.text;
    marker.style.cssText = `position:absolute;right:100%;top:${lines[0].y}px;padding-right:0.6em;line-height:${item.lineHeight}px;color:${item.marker.color}`;
    nodes.push(marker);
  }
  for (const line of lines) {
    for (const fragment of line.fragments) nodes.push(buildFragment(fragment, line.y, item.lineHeight));
  }
  item.lines.replaceChildren(...nodes);
  item.lines.style.height = `${height}px`;
  item.source.hidden = true;
  if (item.listItem) item.listItem.style.listStyleType = "none";
}

function restore(item: FlowItem) {
  item.source.hidden = false;
  item.lines.replaceChildren();
  item.lines.style.height = "";
  if (item.listItem) item.listItem.style.listStyleType = "";
}

function render() {
  frame = 0;
  const obstacle = getIrisObstacle();

  // Read every rect before writing anything, so the pass forces one layout.
  const measured: [FlowItem, DOMRect][] = [];
  for (const item of items) {
    if (item.runs) measured.push([item, item.lines.getBoundingClientRect()]);
  }

  let changed = false;
  for (const [item, rect] of measured) {
    if (rect.width < MIN_SLOT_WIDTH) continue;
    const reach = obstacle ? obstacle.r + V_PAD + item.lineHeight : 0;
    const clear =
      !obstacle || rect.bottom < obstacle.y - reach || rect.top > obstacle.y + reach;
    if (clear && item.clearWidth === rect.width) continue;

    const { lines, height, signature } = layoutItem(item, rect, clear ? null : obstacle);
    item.clearWidth = clear ? rect.width : -1;
    if (signature === item.signature && item.lines.style.height === `${height}px`) continue;
    item.signature = signature;
    write(item, lines, height);
    changed = true;
  }

  // A block's new height moves the blocks below it; let them catch up.
  if (changed && settlePasses < MAX_SETTLE_PASSES) {
    settlePasses++;
    schedule(false);
  }
}

/** Flows a block's inline text around the iris until the returned cleanup runs. */
export function registerFlow(
  root: HTMLElement,
  source: HTMLElement,
  lines: HTMLElement,
  listItem: HTMLLIElement | null,
): () => void {
  const item: FlowItem = {
    root,
    source,
    lines,
    listItem,
    runs: null,
    lineHeight: 0,
    marker: null,
    signature: "",
    clearWidth: -1,
  };
  items.add(item);
  ensureListeners();

  // Measuring before the web font loads would size every line in the fallback font.
  document.fonts.ready.then(() => {
    if (!items.has(item)) return;
    prepare(item);
    schedule();
  });

  return () => {
    items.delete(item);
    restore(item);
    if (items.size === 0) {
      teardown?.();
      teardown = null;
    }
  };
}
