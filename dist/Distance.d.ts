import { PairFn, KeyFn } from './StressMajorization';
/**
 * Basic distance calculations
 */
export declare const Distance: {
    euclidean: (i: [number, number], j: [number, number]) => number;
    squared: (i: [number, number], j: [number, number]) => number;
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
export declare const DistanceFactory: <T>(distance: PairFn<[number, number]>, x: KeyFn<T>, y: KeyFn<T>) => PairFn<T>;
