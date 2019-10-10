"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Allows Operations over `Point` objects
 */
exports.Point = {
    /** i + j */
    add: function (i, j) { return [i[0] + j[0], i[1] + j[1]]; },
    /** i - j */
    sub: function (i, j) { return [i[0] - j[0], i[1] - j[1]]; },
    /** a \times i */
    mult: function (a, i) { return [i[0] * a, i[1] * a]; },
    /** i \div a */
    div: function (i, a) { return [i[0] / a, i[1] / a]; },
    length: function (i) { return Math.hypot.apply(Math, i); }
};
exports.default = exports.Point;
