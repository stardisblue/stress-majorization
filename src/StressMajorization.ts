import Point from './Point';

export type KeyFn<T> = (i: T) => number;

export type PairFn<T> = (i: T, j: T) => number;

type IgnoreFn<T> = (vi: T, vj: T, i: number, j: number) => boolean;

type Options<T> = {
  weight: PairFn<T>;
  stress: PairFn<T>;
  ignore?: IgnoreFn<T>;
  toPoint: (n: T) => Point;
  fromPoint: (i: Point) => Partial<T>;
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
 *   weight: (i, j) => length(i - j) ** 2,// `WeightFactory` helper allows it to be adapted with `Distance` calculations
 *
 *   stress: (i, j) => 0, // stress function this cannot be defined via helpers :(
 *   toPoint: (i) => i, // accessor to the x coordinate
 *   fromPoint: (i) => i, // accessor to the y coordinate
 *   epsilon: Math.pow(10, -6), // relative change of the configuration
 *   maxIterations: 10000, // number of maximum iteration before stopping
 *   ignore: (i, j, iIdx, jIdx) => iIdx === jIdx, // ignores pair (i, j) when this function returns true
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
export function StressMajorization<T extends object>(
  data: T,
  options: Options<T>
): T;
export function StressMajorization<T>(data: T[], options: Options<T>): T[];
export default function StressMajorization<T>(
  data: T[],
  options: Options<T>
): [T[], number[]] {
  let _data = data;

  const {
    weight,
    stress,
    ignore = (_vi: T, _vj: T, i: number, j: number) => i === j,
    fromPoint = (n: Point) => (n as unknown) as T,
    toPoint = (n: any) => n as Point,
    epsilon = Math.pow(10, -6),
    maxIterations = 10000
  } = options;

  let currentEpsilon: number;
  let wijSum: number;

  // @ts-ignore dirty fix for mapping
  const mapData: number[] = Object.keys(_data);
  const iData: T[] = new Array(mapData.length);
  const len = iData.length;

  // construct points
  let points: Float32Array = new Float32Array(mapData.length * 2);
  for (let i = 0; i < len; i++) {
    // creating data[mapdata[i]] shorthand
    iData[i] = _data[mapData[i]];
    const [x, y] = toPoint(iData[i]);

    points[2 * i] = x;
    points[2 * i + 1] = y;
  }

  const iterations = new Float32Array(maxIterations);
  let iteration = 0;

  do {
    // main loop
    currentEpsilon = 0;
    const pointsNew: Float32Array = new Float32Array(len * 2);

    for (let i = 0; i < len; i++) {
      const vi = iData[i];

      const xIIndex = 2 * i;
      const yIIndex = 2 * i + 1;

      const xi = points[xIIndex];
      const yi = points[yIIndex];

      wijSum = 0;

      for (let j = 0; j < len; j++) {
        const vj = iData[j];

        if (ignore(vi, vj, i, j)) continue; // ignore

        const s_ij = stress(vi, vj);
        const w_ij = weight(vi, vj);

        wijSum += w_ij;

        const xj = points[2 * j];
        const yj = points[2 * j + 1];

        //* sum += w_{i, j} (j + s_{i, j}(i - j))
        pointsNew[xIIndex] += w_ij * (xj + s_ij * (xi - xj));
        pointsNew[yIIndex] += w_ij * (yj + s_ij * (yi - yj));
      }

      //* \frac{\sum_{j!=i, j \in V} w_{i,j} (j + s_{i,j}(i - j))}{\sum w_ij}
      pointsNew[xIIndex] /= wijSum;
      pointsNew[yIIndex] /= wijSum;

      currentEpsilon += Math.hypot(
        pointsNew[xIIndex] - xi,
        pointsNew[yIIndex] - yi
      );
    }
    points = pointsNew;

    // mean epsilon
    currentEpsilon /= len;

    iterations[iteration] = currentEpsilon;
    iteration++;
  } while (currentEpsilon > epsilon && iteration < maxIterations);

  // update position of dataset
  for (let i = 0; i < len; i++) {
    const vi = iData[i];

    const xn = points[2 * i];
    const yn = points[2 * i + 1];

    _data[mapData[i]] = { ...vi, ...fromPoint([xn, yn]) };
  }

  const iteridx = iterations.findIndex(val => val === 0);

  return [_data, Array.from(iterations.slice(0, iteridx))];
}
