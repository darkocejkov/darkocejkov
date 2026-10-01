/** The iris's live footprint in viewport coordinates, for text to flow around. */
export interface IrisObstacle {
  x: number;
  y: number;
  r: number;
}

let current: IrisObstacle | null = null;
const listeners = new Set<() => void>();

export function getIrisObstacle(): IrisObstacle | null {
  return current;
}

export function setIrisObstacle(next: IrisObstacle | null) {
  if (
    current === next ||
    (current && next && current.x === next.x && current.y === next.y && current.r === next.r)
  ) {
    return;
  }
  current = next;
  listeners.forEach((listener) => listener());
}

export function subscribeIrisObstacle(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
