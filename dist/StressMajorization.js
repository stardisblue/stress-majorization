"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Point_1 = __importDefault(require("./Point"));
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
function StressMajorization(data, options) {
    var _data = data;
    var w = options.weight, s = options.stress, _a = options.ignore, ignore = _a === void 0 ? function (_vi, _vj, i, j) { return i === j; } : _a, _b = options.x, x = _b === void 0 ? function (i) { return i[0]; } : _b, _c = options.y, y = _c === void 0 ? function (i) { return i[1]; } : _c, _d = options.epsilon, epsilon = _d === void 0 ? Math.pow(10, -6) : _d;
    var solve = function () {
        var mult = Point_1.default.mult, div = Point_1.default.div, add = Point_1.default.add, sub = Point_1.default.sub, length = Point_1.default.length;
        var currentEpsilon;
        do {
            currentEpsilon = 0;
            var update = [];
            for (var i = 0; i < _data.length; i++) {
                var vi = _data[i];
                var iPt = [x(vi), y(vi)];
                var topSum = [0, 0];
                var wijSum = 0;
                for (var j = 0; j < _data.length; j++) {
                    var vj = _data[j];
                    if (ignore(vi, vj, i, j))
                        continue; // ignore
                    var jPt = [x(vj), y(vj)];
                    var w_ij = w(vi, vj);
                    //* sum += w_{i,j} (j + s_{i,j}(i - j))
                    topSum = add(topSum, mult(w_ij, add(jPt, mult(s(vi, vj), sub(iPt, jPt)))));
                    wijSum += w_ij;
                }
                var iPtNew = div(topSum, wijSum);
                currentEpsilon += length(sub(iPt, iPtNew));
                //* \frac{\sum_{j!=i, j \in V} w_{i,j} (j + s_{i,j}(i - j))}{\sum w_ij}
                update.push(__assign(__assign({}, vi), iPtNew));
            }
            currentEpsilon /= update.length;
            _data = update;
        } while (currentEpsilon > epsilon);
        return _data;
    };
    return solve();
}
exports.default = StressMajorization;
