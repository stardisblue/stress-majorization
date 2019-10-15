import Point from './Point';

export type KeyFn<T> = (i: T) => number;

export type PairFn<T> = (
  xi: number,
  yi: number,
  xj: number,
  yj: number,
  i: T,
  j: T
) => number;

type IgnoreFn<T> = (
  i: number,
  j: number,
  xi: number,
  yi: number,
  xj: number,
  yj: number,
  vi: T,
  vj: T
) => boolean;

type Options<T> = {
  weight: PairFn<T>;
  stress: PairFn<T>;
  ignore?: IgnoreFn<T>;
  toPoint: (n: T) => Point;
  fromPoint: (i: Point, n: T) => T;
  epsilon?: number;
  maxIterations?: number;
};

/**
 * Solves configuration using Stress Majorization
 *
 * Example
 * =======
 *
 * ```ts
 * const [result, epsilons] = StressMajorization([[0, 0], [0, 1], ...], {
 *   weight: (xi, yi, xj, yj, i, j) => (xi - xj) ** 2 + (yi - yj) ** 2,// `WeightFactory` helper allows it to be adapted with `Distance` calculations
 *
 *   stress: (xi, yi, xj, yj, i, j) => 0, // stress function this cannot be defined via helpers :(
 *   toPoint: (i) => i, // accessor to the x coordinate
 *   fromPoint: (i) => i, // accessor to the y coordinate
 *   epsilon: Math.pow(10, -6), // relative change of the configuration
 *   maxIterations: 10000, // number of maximum iteration before stopping, if <= 0, will be unlimited
 *   ignore: (iIdx, jIdx, xi, yi, xj, yj, i, j) => iIdx === jIdx, // ignores pair (i, j) when this function returns true
 * })
 * ```
 *
 * Default
 * =======
 *
 * if a point is represented by `[x, y]` then, the accessors don't need to be defined
 * ```js
 * const defaultOptions = {
 *   toPoint: (i) => i,
 *   fromPoint: (i) => i,
 *   epsilon: Math.pow(10, -6),
 *   maxIterations: 10000,
 *   ignore: (i, j, iIdx, jIdx) => iIdx === jIdx
 * }
 * ```
 *
 * @param data array containing each point
 * @param options options
 *
 * @returns an array containing the data and epsilons of each iterations :
 *  [data, epsilons]
 */
export default function StressMajorization<T>(
  data: T[],
  options: Options<T>
): [T[], number[]];
export default function StressMajorization<T, S>(
  data: S,
  options: Options<S[keyof S]>
): [S, number[]];
export default function StressMajorization<T>(
  data: any,
  options: Options<any>
): [any, number[]] {
  let _data = data;

  const {
    weight,
    stress,
    ignore = (i: number, j: number) => i === j,
    fromPoint = (u: Point) => (u as unknown) as T,
    toPoint = (u: any) => u as Point,
    epsilon = Math.pow(10, -6),
    maxIterations = 10000
  } = options;

  let sum_w: number;
  // @ts-ignore dirty fix for mapping
  const mapData: number[] = Object.keys(_data);
  const iData: T[] = new Array(mapData.length);
  const length = iData.length;

  // construct points
  let points: Float32Array = new Float32Array(length * 2);
  for (let i = 0; i < length; i++) {
    // creating data[mapdata[i]] shorthand
    iData[i] = _data[mapData[i]];
    const [x, y] = toPoint(iData[i]);

    points[2 * i] = x;
    points[2 * i + 1] = y;
  }

  const limited = maxIterations > 0;

  const iterations = limited ? new Float32Array(maxIterations) : [];
  let iter = 0;

  let currentEpsilon: number;
  do {
    // main loop
    currentEpsilon = 0;
    const pointsNew: Float32Array = new Float32Array(length * 2);

    for (let i = 0; i < length; i++) {
      const u = iData[i];

      const xi_idx = 2 * i;
      const yi_idx = 2 * i + 1;

      const xi = points[xi_idx];
      const yi = points[yi_idx];

      sum_w = 0;

      for (let j = 0; j < length; j++) {
        const v = iData[j];

        const xj = points[2 * j];
        const yj = points[2 * j + 1];

        if (ignore(i, j, xi, yi, xj, yj, u, v)) continue; // ignore

        const s_ij = stress(xi, yi, xj, yj, u, v);
        const w_ij = weight(xi, yi, xj, yj, u, v);

        sum_w += w_ij;

        //* sum += w_{i, j} (j + s_{i, j}(i - j))
        pointsNew[xi_idx] += w_ij * (xj + s_ij * (xi - xj));
        pointsNew[yi_idx] += w_ij * (yj + s_ij * (yi - yj));
      }

      //* \frac{\sum_{j!=i, j \in V} w_{i,j} (j + s_{i,j}(i - j))}{\sum w_ij}
      pointsNew[xi_idx] /= sum_w;
      pointsNew[yi_idx] /= sum_w;

      currentEpsilon += Math.hypot(
        pointsNew[xi_idx] - xi,
        pointsNew[yi_idx] - yi
      );
    }
    points = pointsNew;

    // mean epsilon, should not be this :)
    // currentEpsilon /= length;

    iterations[iter] = currentEpsilon;
    iter++;
  } while (currentEpsilon > epsilon && iter === maxIterations);

  // update position of dataset
  for (let i = 0; i < length; i++) {
    const u = iData[i];

    const x = points[2 * i];
    const y = points[2 * i + 1];

    _data[mapData[i]] = fromPoint([x, y], u);
  }

  if (!limited) {
    return [_data, iterations as number[]];
  }

  const iteridx = iterations.findIndex((val: number) => val === 0);

  return [
    _data,
    iteridx > 0
      ? Array.from(iterations.slice(0, iteridx))
      : iteridx === -1
      ? Array.from(iterations)
      : []
  ];
}
