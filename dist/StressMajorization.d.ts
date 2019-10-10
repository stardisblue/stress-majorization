export declare type KeyFn<T> = (i: T) => number;
export declare type PairFn<T> = (i: T, j: T) => number;
declare type IgnoreFn<T> = (vi: T, vj: T, i: number, j: number) => boolean;
declare type Options<T> = {
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
export default function StressMajorization<T>(data: T[], options: Options<T>): T[];
export {};
