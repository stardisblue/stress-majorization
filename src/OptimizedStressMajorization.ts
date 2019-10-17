export type PairFn = (
  xi: number,
  yi: number,
  xj: number,
  yj: number,
  i: number,
  j: number
) => number;

type IgnoreFn = (
  i: number,
  j: number,
  xi: number,
  yi: number,
  xj: number,
  yj: number
) => boolean;

type Options = {
  weight: PairFn;
  stress: PairFn;
  ignore?: IgnoreFn;
  epsilon?: number;
  maxIterations?: number;
};

/**
 * Solves configuration using Stress Majorization
 * data needs to be a single dimension array
 * Example
 * =======
 *
 * ```ts
 * const [result, epsilons] = StressMajorization([0,0, 0,1, ...], {
 *   weight: (xi, yi, xj, yj, i, j) => (xi - xj) ** 2 + (yi - yj) ** 2,// `WeightFactory` helper allows it to be adapted with `Distance` calculations
 *
 *   stress: (xi, yi, xj, yj, i, j) => 0, // stress function this cannot be defined via helpers :(
 *   ignore: (i, j, xi, yi, xj, yj) => i === j, // ignores pair (i, j) when this function returns true
 *   epsilon: Math.pow(10, -6), // relative change of the configuration
 *   maxIterations: 10000, // number of maximum iteration before stopping, if <= 0, will be unlimited
 * })
 * ```
 *
 * Default
 * =======
 *
 * ```js
 * const defaultOptions = {
 *   epsilon: Math.pow(10, -6),
 *   maxIterations: 10000,
 *   ignore: (i, j) => i === j
 * }
 * ```
 *
 * @param data array containing each point
 * @param options options
 *
 * @returns an array containing the data and epsilons of each iterations :
 *  [data, epsilons]
 */
export default function OptimizedStressMajorization(
  data: Float32Array,
  options: Options
): [Float32Array, number[]] {
  let points = data;

  const {
    weight,
    stress,
    ignore = (i: number, j: number) => i === j,
    epsilon = Math.pow(10, -6),
    maxIterations = 10000
  } = options;

  const length = points.length >> 1;

  const limited = maxIterations > 0;

  const iterations = limited ? new Float32Array(maxIterations) : [];

  let iter = 0;
  let currEpsi: number, sum_w: number;

  do {
    // main loop
    //reset current
    currEpsi = 0;

    const pointsNew: Float32Array = new Float32Array(points.length);

    for (let i = 0; i < length; i++) {
      const xi_idx = 2 * i;
      const yi_idx = 2 * i + 1;

      const xi = points[xi_idx];
      const yi = points[yi_idx];

      sum_w = 0;

      for (let j = 0; j < length; j++) {
        const xj = points[2 * j];
        const yj = points[2 * j + 1];

        if (ignore(i, j, xi, yi, xj, yj)) continue; // ignore

        const s_ij = stress(xi, yi, xj, yj, i, j);
        const w_ij = weight(xi, yi, xj, yj, i, j);

        sum_w += w_ij;

        //* sum += w_{i, j} (j + s_{i, j}(i - j))
        pointsNew[xi_idx] += w_ij * (xj + s_ij * (xi - xj));
        pointsNew[yi_idx] += w_ij * (yj + s_ij * (yi - yj));
      }

      //* \frac{\sum_{j!=i, j \in V} w_{i,j} (j + s_{i,j}(i - j))}{\sum w_ij}
      pointsNew[xi_idx] /= sum_w;
      pointsNew[yi_idx] /= sum_w;

      currEpsi += Math.hypot(pointsNew[xi_idx] - xi, pointsNew[yi_idx] - yi);
    }
    points = pointsNew;

    // mean epsilon, should not be this :)
    // currentEpsilon /= length;
    iterations[iter] = currEpsi;
    iter++;
    // loop while relative change > epsilon and didn't reach maximum iterations
  } while (
    (iter === 1 || Math.abs(iterations[iter - 2] - currEpsi) > epsilon) &&
    iter !== maxIterations
  );

  if (!limited) {
    return [points, iterations as number[]];
  }

  const iteridx = iterations.findIndex((val: number) => val === 0);

  if (iteridx > 0) {
    return [points, Array.from(iterations.slice(0, iteridx))];
  } else if (iteridx === -1) {
    return [points, Array.from(iterations)];
  }

  return [points, []];
}
