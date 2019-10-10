export declare type Point = [number, number];
/**
 * Allows Operations over `Point` objects
 */
export declare const Point: {
    /** i + j */
    add: (i: [number, number], j: [number, number]) => [number, number];
    /** i - j */
    sub: (i: [number, number], j: [number, number]) => [number, number];
    /** a \times i */
    mult: (a: number, i: [number, number]) => [number, number];
    /** i \div a */
    div: (i: [number, number], a: number) => [number, number];
    length: (i: [number, number]) => number;
};
export default Point;
