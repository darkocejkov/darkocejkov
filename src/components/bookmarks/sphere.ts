export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** `count` points spread evenly over the unit sphere. */
export function fibonacciSphere(count: number): Vec3[] {
  return Array.from({ length: count }, (_, i) => {
    const y = count === 1 ? 0 : 1 - (2 * (i + 0.5)) / count;
    const ring = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    return { x: Math.cos(theta) * ring, y, z: Math.sin(theta) * ring };
  });
}

/** Yaw about the vertical axis, then pitch about the horizontal one. +z faces the viewer. */
export function rotate(p: Vec3, yaw: number, pitch: number): Vec3 {
  const x1 = p.x * Math.cos(yaw) - p.z * Math.sin(yaw);
  const z1 = p.x * Math.sin(yaw) + p.z * Math.cos(yaw);
  return {
    x: x1,
    y: p.y * Math.cos(pitch) - z1 * Math.sin(pitch),
    z: p.y * Math.sin(pitch) + z1 * Math.cos(pitch),
  };
}

/** The rotation that brings `p` to the point nearest the viewer. */
export function faceFront(p: Vec3): { yaw: number; pitch: number } {
  const yaw = Math.atan2(p.x, p.z);
  return { yaw, pitch: Math.atan2(p.y, Math.hypot(p.x, p.z)) };
}

/** Perspective scale for a point at depth `z` on a unit sphere, with the eye `distance` radii away. */
export function perspective(z: number, distance: number): number {
  return distance / (distance - z);
}

/** Shortest equivalent of `to` relative to `from`, so a spin never takes the long way round. */
export function nearestAngle(from: number, to: number): number {
  const turn = 2 * Math.PI;
  return from + ((((to - from) % turn) + turn + Math.PI) % turn) - Math.PI;
}
