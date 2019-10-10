import Point from './Point';

export type KeyFn<T> = (i: T) => number;

export type PairFn<T> = (i: T, j: T) => number;

type IgnoreFn<T> = (vi: T, vj: T, i: number, j: number) => boolean;

type Options<T> = {
  weight: PairFn<T>;
  stress: PairFn<T>;
  ignore?: IgnoreFn<T>;
  x?: KeyFn<T>;
  y?: KeyFn<T>;
  epsilon?: number;
};

/**
 * Solves configuration using Stress Majorization
 *
 * Example
 * =======
 *
 * ```ts
 * const result = StressMajorization([[0, 0], [0, 1], ...], {
 *   weight: (i, j) => length(i - j) ** 2,// `WeightFactory` helper allows it to be adapted with `Distance` calculations
 *
 *   stress: (i, j) => 0, // stress function this cannot be defined via helpers :(
 *   x: (i) => i[0], // accessor to the x coordinate
 *   y: (i) => i[1], // accessor to the y coordinate
 *   epsilon: Math.pow(10, -6), // relative change of the configuration
 *   ignore: (i, j, iIdx, jIdx) => iIdx === jIdx // ignores pair (i, j) when this function returns true
 * })
 * ```
 *
 * Default
 * =======
 *
 * if a point is represented by `[x, y]` then, the accessors don't need to be defined
 * ```js
 * const defaultOptions = {
 *   x: (i) => i[0],
 *   y: (i) => i[1],
 *   epsilon:  Math.pow(10, -6)
 *   ignore: (i, j, iIdx, jIdx) => iIdx === jIdx
 * }
 * ```
 *
 * @param data array containing each point
 * @param options options
 */
export default function StressMajorization<T>(
  data: T[],
  options: Options<T>
): T[] {
  let _data = data;
  const {
    weight: w,
    stress: s,
    ignore = (_vi: T, _vj: T, i: number, j: number) => i === j,
    x = (i: any) => i[0],
    y = (i: any) => i[1],
    epsilon = Math.pow(10, -6)
  } = options;
  const solve = function() {
    const { mult, div, add, sub, length } = Point;
    let currentEpsilon: number;
    do {
      currentEpsilon = 0;
      const update: T[] = [];
      for (let i = 0; i < _data.length; i++) {
        const vi = _data[i];
        const iPt: Point = [x(vi), y(vi)];
        let topSum: Point = [0, 0];
        let wijSum: number = 0;
        for (let j = 0; j < _data.length; j++) {
          const vj = _data[j];
          if (ignore(vi, vj, i, j)) continue; // ignore
          const jPt: Point = [x(vj), y(vj)];
          const w_ij = w(vi, vj);
          //* sum += w_{i,j} (j + s_{i,j}(i - j))
          topSum = add(
            topSum,
            mult(w_ij, add(jPt, mult(s(vi, vj), sub(iPt, jPt))))
          );
          wijSum += w_ij;
        }
        const iPtNew = div(topSum, wijSum);
        currentEpsilon += length(sub(iPt, iPtNew));
        //* \frac{\sum_{j!=i, j \in V} w_{i,j} (j + s_{i,j}(i - j))}{\sum w_ij}
        update.push({ ...vi, ...iPtNew });
      }
      currentEpsilon /= update.length;
      _data = update;
    } while (currentEpsilon > epsilon);
    return _data;
  };
  return solve();
}
