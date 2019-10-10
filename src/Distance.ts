import Point from './Point';
import { PairFn, KeyFn } from './StressMajorization';

/**
 * Basic distance calculations
 */
export const Distance = {
  euclidean: (i: Point, j: Point) => Point.length(Point.sub(i, j)),
  squared: (i: Point, j: Point) => Point.length(Point.sub(i, j)) ** 2
};
export default Distance;

/**
 * Helper which creates a function based on accessors and the distance computation function choosed :
 *
 * ```js
 * const distance = DistanceFactory(Distance.euclidean, (i) => i.x, (i) => i.y)
 * ```
 *
 * @param distance function for computing distance between two points
 * @param x accessor
 * @param y accessor
 */
export const DistanceFactory = <T>(
  distance: PairFn<Point>,
  x: KeyFn<T>,
  y: KeyFn<T>
): PairFn<T> => (i: T, j: T) => distance([x(i), y(i)], [x(j), y(j)]);
