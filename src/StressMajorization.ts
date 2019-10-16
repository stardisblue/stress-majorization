import Point from './Point';
import OptimizedStressMajorization from './OptimizedStressMajorization';

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

  let [newPoints, iterations] = OptimizedStressMajorization(points, {
    epsilon: epsilon,
    ignore: (i, j, xi, yi, xj, yj) =>
      ignore(i, j, xi, yi, xj, yj, iData[i], iData[j]),
    weight: (xi, yi, xj, yj, i, j) =>
      weight(xi, yi, xj, yj, iData[i], iData[j]),
    stress: (xi, yi, xj, yj, i, j) =>
      stress(xi, yi, xj, yj, iData[i], iData[j]),
    maxIterations
  });

  // update position of dataset
  for (let i = 0; i < length; i++) {
    const u = iData[i];

    const x = newPoints[2 * i];
    const y = newPoints[2 * i + 1];

    _data[mapData[i]] = fromPoint([x, y], u);
  }

  return [_data, iterations];
}
