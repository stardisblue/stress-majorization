"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var StressMajorization_1 = __importDefault(require("./StressMajorization"));
var Weight_1 = __importDefault(require("./Weight"));
exports.WeightFactory = Weight_1.default;
var Distance_1 = __importStar(require("./Distance"));
exports.Distance = Distance_1.default;
exports.DistanceFactory = Distance_1.DistanceFactory;
var Point_1 = __importDefault(require("./Point"));
exports.Point = Point_1.default;
exports.default = StressMajorization_1.default;
