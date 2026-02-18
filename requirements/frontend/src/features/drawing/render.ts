// src/features/drawing/render.ts
export function pointsToPathD(points: Array<[number, number]>, w: number, h: number) {
  if (points.length === 0) return "";
  const [x0, y0] = points[0];
  let d = `M ${x0 * w} ${y0 * h}`;
  for (let i = 1; i < points.length; i++) {
    const [x, y] = points[i];
    d += ` L ${x * w} ${y * h}`;
  }
  return d;
}
