export interface Wall {
  x: number;
  z: number;
  width: number;
  depth: number;
  kind?: "outer" | "partition";
}
export const FLOOR_Y = -1.6;
export const WALL_HEIGHT = 6;
export const PLAYER_RADIUS = 0.42;
export const ENTRANCE = { x: 0, z: 21 };

// One source of truth for rendered walls, collision detection and the floor plan.
export const museumWalls: Wall[] = [
  { x: -22, z: 0, width: 0.4, depth: 50, kind: "outer" },
  { x: 22, z: 0, width: 0.4, depth: 50, kind: "outer" },
  { x: 0, z: -25, width: 44, depth: 0.4, kind: "outer" },
  { x: 0, z: 25, width: 44, depth: 0.4, kind: "outer" },
  ...[-6, 6].flatMap((x) => [
    { x, z: -15, width: 0.4, depth: 4, kind: "partition" as const },
    { x, z: -2.5, width: 0.4, depth: 9, kind: "partition" as const },
    { x, z: 9, width: 0.4, depth: 2, kind: "partition" as const },
  ]),
  // Side galleries have their own connecting doors, centred at x = ±14.
  ...[-1, 1].flatMap((side) => [
    { x: side * 19, z: -3, width: 6, depth: 0.4, kind: "partition" as const },
    { x: side * 9, z: -3, width: 6, depth: 0.4, kind: "partition" as const },
    { x: side * 13, z: -17, width: 18, depth: 0.4, kind: "partition" as const },
  ]),
];
export const museumObstacles: Wall[] = [
  { x: -11, z: 16, width: 3.2, depth: 3.2 },
  { x: 11, z: 17, width: 5, depth: 1.4 },
  { x: 0, z: -21, width: 5, depth: 1.4 },
];
export const exhibitSlots: {
  position: [number, number, number];
  yaw: number;
  size: [number, number];
}[] = [
  { position: [-21.72, 0.9, 4], yaw: Math.PI / 2, size: [6.4, 3.6] },
  { position: [-21.72, 0.9, -10], yaw: Math.PI / 2, size: [6.4, 3.6] },
  { position: [21.72, 0.9, 4], yaw: -Math.PI / 2, size: [6.4, 3.6] },
  { position: [21.72, 0.9, -10], yaw: -Math.PI / 2, size: [6.4, 3.6] },
  { position: [-11, 0.9, -24.72], yaw: 0, size: [6.4, 3.6] },
  { position: [11, 0.9, -24.72], yaw: 0, size: [6.4, 3.6] },
];
export function canWalk(x: number, z: number): boolean {
  if (
    !Number.isFinite(x) ||
    !Number.isFinite(z) ||
    Math.abs(x) > 21.35 ||
    Math.abs(z) > 24.35
  )
    return false;
  return ![...museumWalls, ...museumObstacles].some((wall) => {
    const nearestX = Math.max(
      wall.x - wall.width / 2,
      Math.min(x, wall.x + wall.width / 2),
    );
    const nearestZ = Math.max(
      wall.z - wall.depth / 2,
      Math.min(z, wall.z + wall.depth / 2),
    );
    return (x - nearestX) ** 2 + (z - nearestZ) ** 2 < PLAYER_RADIUS ** 2;
  });
}
export function moveThroughMuseum(
  x: number,
  z: number,
  dx: number,
  dz: number,
) {
  // Small steps prevent crossing a thin wall after a slow frame. Axis separation allows sliding.
  const steps = Math.max(
    1,
    Math.ceil(Math.max(Math.abs(dx), Math.abs(dz)) / 0.15),
  );
  for (let step = 0; step < steps; step++) {
    if (canWalk(x + dx / steps, z)) x += dx / steps;
    if (canWalk(x, z + dz / steps)) z += dz / steps;
  }
  return { x, z };
}
export function museumZone(x: number, z: number) {
  if (z > 10) return "Welcome hall";
  if (z < -17) return "05 / Shared stories";
  if (Math.abs(x) < 6) return "The culture walk";
  if (x < 0)
    return z > -3 ? "01 / Material & making" : "02 / Everyday knowledge";
  return z > -3 ? "03 / Pattern & expression" : "04 / Art & place";
}

export interface DisplayLocation {
  id: string;
  position: [number, number, number];
  yaw: number;
}

function wallBlocksSegment(
  x: number,
  z: number,
  targetX: number,
  targetZ: number,
  wall: Wall,
) {
  let entry = 0,
    exit = 1;
  for (const [origin, delta, low, high] of [
    [x, targetX - x, wall.x - wall.width / 2, wall.x + wall.width / 2],
    [z, targetZ - z, wall.z - wall.depth / 2, wall.z + wall.depth / 2],
  ]) {
    if (Math.abs(delta) < 1e-8) {
      if (origin < low || origin > high) return false;
    } else {
      const a = (low - origin) / delta,
        b = (high - origin) / delta;
      entry = Math.max(entry, Math.min(a, b));
      exit = Math.min(exit, Math.max(a, b));
      if (entry > exit) return false;
    }
  }
  return entry < 0.99 && exit > 0.01;
}

export function nearbyExhibit<T extends DisplayLocation>(
  x: number,
  z: number,
  exhibits: readonly T[],
  currentId?: string,
): T | null {
  let nearest: T | null = null,
    nearestDistance = Infinity;
  for (const exhibit of exhibits) {
    const [ex, , ez] = exhibit.position;
    const dx = x - ex,
      dz = z - ez;
    const distance = Math.hypot(dx, dz);
    // A small release margin prevents flicker when standing on the activation boundary.
    const radius = exhibit.id === currentId ? 7.5 : 6.5;
    if (distance > radius || distance >= nearestDistance) continue;
    if (dx * Math.sin(exhibit.yaw) + dz * Math.cos(exhibit.yaw) <= 0.05)
      continue;
    if (museumWalls.some((wall) => wallBlocksSegment(x, z, ex, ez, wall)))
      continue;
    nearest = exhibit;
    nearestDistance = distance;
  }
  return nearest;
}

export function viewSectorPath(
  x: number,
  z: number,
  yaw: number,
  horizontalFov: number,
  radius = 10,
): string {
  const half = (Math.max(1, Math.min(170, horizontalFov)) * Math.PI) / 360;
  const leftX = x - Math.sin(yaw + half) * radius;
  const leftZ = z - Math.cos(yaw + half) * radius;
  const rightX = x - Math.sin(yaw - half) * radius;
  const rightZ = z - Math.cos(yaw - half) * radius;
  return `M ${x} ${z} L ${leftX} ${leftZ} A ${radius} ${radius} 0 0 1 ${rightX} ${rightZ} Z`;
}
