"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.WeightFactory = function (distance) {
    return {
        one: function () { return 1; },
        distance: distance,
        distanceInversePow: function (i, j) { return Math.pow(distance(i, j), -1); },
        distanceInverse2Pow: function (i, j) { return Math.pow(distance(i, j), -2); },
        exponentialInverseDistance: function (i, j) { return Math.exp(-distance(i, j)); }
    };
};
exports.default = exports.WeightFactory;
