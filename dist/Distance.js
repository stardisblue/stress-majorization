"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = __importDefault(require("./Point"));
/**
 * Basic distance calculations
 */
exports.Distance = {
    euclidean: function (i, j) { return Point_1.default.length(Point_1.default.sub(i, j)); },
    squared: function (i, j) { return Math.pow(Point_1.default.length(Point_1.default.sub(i, j)), 2); }
};
exports.default = exports.Distance;
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
exports.DistanceFactory = function (distance, x, y) { return function (i, j) { return distance([x(i), y(i)], [x(j), y(j)]); }; };
