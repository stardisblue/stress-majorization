type PairFn<T> = (i: T, j: T) => number;

/**
 * Creates default Weight list based on how the distance computation
 *
 * ```ts
 * const distance = DistanceFactory(Distance.euclidean, (i) => i.x, (i) => i.y)
 * const weight = WeightFactory(distance).one
 *
 * weight(a, b) // will return 1 if `one` is choosed
 * ```
 *
 * __Available Weights__ :
 *
 * ```js
 * const weight = WeightFactory(distance)
 * ```
 *
 * __returns__
 *
 * ```js
 * {
 *   one: () => 1,
 *   distance: (i, j) => distance(i, j),
 *   distanceInversePow: (i, j) => Math.pow(distance(i, j), -1),
 *   distanceInverse2Pow: (i, j) => Math.pow(distance(i, j), -2),
 *   exponentialInverseDistance: (i, j) => Math.exp(-distance(i, j))
 * }
 * ```
 *
 * @param distance how distance between nodes is computed
 */
export const WeightFactory = <T>(distance: PairFn<T>) => {
  return {
    one: (): 1 => 1,
    distance,
    distanceInversePow: (i: T, j: T) => Math.pow(distance(i, j), -1),
    distanceInverse2Pow: (i: T, j: T) => Math.pow(distance(i, j), -2),
    exponentialInverseDistance: (i: T, j: T) => Math.exp(-distance(i, j))
  };
};
export default WeightFactory;
