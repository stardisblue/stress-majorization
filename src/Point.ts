export type Point = [number, number];

/**
 * Allows Operations over `Point` objects
 */
export const Point = {
  /** i + j */
  add: (i: Point, j: Point): Point => [i[0] + j[0], i[1] + j[1]],
  /** i - j */
  sub: (i: Point, j: Point): Point => [i[0] - j[0], i[1] - j[1]],
  /** a \times i */
  mult: (a: number, i: Point): Point => [i[0] * a, i[1] * a],
  /** i \div a */
  div: (i: Point, a: number): Point => [i[0] / a, i[1] / a],

  length: (i: Point): number => Math.hypot(...i)
};

export default Point;
