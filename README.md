# Stress Majorization

Stress Majorization implementation in Typescript, for 2 dimensional data. Was concieved primary for graph drawing.

A future implementation may include n dimensional data.

## Features

- Distance helpers
- Weight helpers
- Pure js, no dependencies
- allows for custom datasets.
- allows for partial iteration of pairs
- :construction: tests coming soon

## Installing

Using npm:

    $ npm install stress-majorization

Using yarn:

    $ yarn add stress-majorization

## Examples

Simple case :

```js
const StressMajorization = require('stress-majorization');
const result = StressMajorization(
  /*data:*/ [[0, 0], [0, 1]],
  /*options:*/ {
    weight: (i, j) => {
      /*your custom code 
      returns number*/
    },
    stress: (i, j) => {
      /*your custom code 
      returns number*/
    }
    /* Default options
    fromPoint: (i) => i,
    toPoint: (i, n) => i,
    ignore: (_i, j, _iIdx, jIdx) => iIdx === jIdx,
    epsilon: Math.pow(10, -6),
    maxIterations: 10000
    */
  }
);
// returns data with updated positions and an array containing epsilon for each iteration
//    => [data, epsilons]
```

> **:warning: Note** : in this example, points are named `i` and `j`, their indexes are `iIdx` and `jIdx`

### Custom datasets

> **:warning: Note**: `dataset` can be an object with attributes `{a: {x: 10, y: 10}, b: {x: 11, y: 12}, /*...*/}` or an array : `[a, b, c, ...]`. If dataset is an object, keys will be retrieved using `Object.keys`.

To allow custom data, define fromPoint and toPoint callbacks

```js
const weight = () => 1; // example fill
const stress = () => 1; // not realcase

const customData = [
  { x: 0, y: 0, z: 5 },
  { x: 1, y: 10, z: 'Hello' } /*, ...*/
];

const [result, epsilons] = StressMajorization(customData, {
  weight: weight,
  stress: stress,
  fromPoint: ([x, y], n) => ({ ...n, x, y }),
  toPoint: ({ x, y }) => [x, y]
});
```

### Ignore pairs

By default `StressMajorization` is solved over all possible pairs of items in `data` (`O(n²`)), a pair of the same item will be ignored.
It is possible to skip pairs by passing an `ignore` function in the options.

```js
// ignoring same position nodes
const result = StressMajorization(data, {
  weight: weight,
  stress: stress,
  fromPoint: ([x, y]) => ({ x, y }),
  toPoint: ({ x, y }) => [x, y],
  ignore: (i, j, iIdx, jIdx) => i.x === j.x && i.y === j.y
});
```

> **:warning: Note**: Be careful when defining custom a ignore function, iterating over a pair `(i, i)` (same item in the pair) can result in funny behaviour

### Helpers

Several helpers come alongside the algorithm.

**`Distance`** which allows for custom distance calculations.

`DistanceFactory` was created to allow for distance calculations over custom data.

```js
import { Distance, DistanceFactory } from 'stress-majorization';

// Retrieve euclidean distance computation
const euclidean = Distance.default;
// euclidean =
//     (i: [number, number], j: [number, number]) => number

// custom data
const distance = DistanceFactory(euclidean, i => i.x, i => i.y);
// distance = (i, j) => number
// coordinates of (i, j) will be retrieved using the accessors
```

**`Weight`** Different weight were defined for stress majorization, they are put together in this object. Weight Calculation depend on distance computation.

```js
import { Distance, DistanceFactory, WeightFactory } from 'stress-majorization';

// Retrieve euclidean distance computation
const distance = DistanceFactory(Distance.default, i => i.x, i => i.y);
// distance = (i, j) => number

const weight = WeightFactory(distance);
/* weight = {
   one: () => 1,
   distance: (i, j) => distance(i, j),
   distanceInversePow: (i, j) => Math.pow(distance(i, j), -1),
   distanceInverse2Pow: (i, j) => Math.pow(distance(i, j), -2),
   exponentialInverseDistance: (i, j) => Math.exp(-distance(i, j))
 }*/
```

This weight can be then injected

```js
const result = StressMajorization(data, { weight: weight /*...*/ });
```

> **Note**: custom distances can be passed to the factory, not only `Distance` functions:
>
> ```js
> const hamilton = (i, j) => Math.abs(i.x - j.x) + Math.abs(i.y - j.y);
> const weight = WeightFactory(hamilton);
> ```

## API

### `StressMajorization(data, options)`

#### `data`

can be anything as long as it is an array of things with number coordinates

```js
const data = [[0, 0], [0, 1] /*...*/]; // works
const data = [{ x: 1, y: 1 }, { x: 0, y: 5 } /*...*/]; // also works (with custom accessors)
const data = [{ a: 1, z: 1 }, { a: 0, z: 5 } /*...*/]; // also works (with custom accessors)
const data = { a: [0, 0], b: [0, 1] }; // works, not continous natural numbers
const data = [];
data[0] = { x: 1, y: 1 };
data[5] = { x: 1, y: 10 }; // will work
```

### `options`: Configuration

> `i` and `j` are items of the data array. They have the same type, information other that those accessible via coordinate accessors are also available.

```js
const options = {
  // weight between two points. The points I, J will be the items from the dataset
  weight: (i, j) => number,

  // Stress function, i, j represents items from the dataset
  stress: (i, j) => number,

  // converts `Point` (internal object structure) to coordinates of the output object. Passes new coordinates (Point ) and the current item (n)
  fromPoint: ([x, y], n) => ({ x, y }), // default to (i) => i

  // converts data item to `Point` (internal)
  toPoint: ({ x, y }) => [x, y], // default to (i) => i

  // will ignore stress on this pair if yields true, iIdx and jIdx are the position of i, j in the data array
  ignore: (i, j, iIdx, jIdx) => boolean, // default to (i, j, iIdx, jIdx) => iIdx === jIdx

  // Threshold of change between each iteration, if the change is less that epsilon, the aglorithm will stop and return the solution
  epsilon: number, // default to Math.pow(10, -6)

  // Maximum iterations allowed, if the algorithm either reaches this or epsilon, it will return whatever the result was computed up to this point. If set to 0, it will ignore the maximum iteration check
  maxIterations: number // default to 10000
};
```

### `Distance`

Distances measurement algorithm

```js
const Distance = {
    // euclidean distance
    euclidean: (i: [number, number], j: [number, number]) : number,

    // squared distance
    squared: (i: [number, number], j: [number, number]) : number
}
```

#### `DistanceFactory(distance, x, y)`

> **Note** `Point` will be used instead of `[number, number]` because it's easier to read

- distance: `(i: Point, j:Point) => number`
- x: `(i: any) => number`
- y: `(i: any) => number`

##### returns

```js
(i, j) => number;
```

> **Note** Defined in Typescript as :
>
> ```ts
> type Point = [number, number];
> const DistanceFactory = <T>(
>   distance: (i: Point, j: Point) => number,
>   x: (i: T) => number,
>   y: (i: T) => number
> ): (i: T, j: T) => number
> ```

### `WeightFactory(distance)`

Creates weight functions based on the distance measurement

- distance : `(i: any, j: any) => number`. Need to be adapter for the data (by using `DistanceFactory` for example)

#### returns

```js
{
   one: () => 1,
   distance: (i, j) => distance(i, j),
   distanceInversePow: (i, j) => Math.pow(distance(i, j), -1),
   distanceInverse2Pow: (i, j) => Math.pow(distance(i, j), -2),
   exponentialInverseDistance: (i, j) => Math.exp(-distance(i, j))
 }
```

### `Point`

contains basic operations for vector manipulation

**`Point.add(i: Point, j: Point)`** : i + j

**`Point.sub(i: Point, j: Point)`** : i - j

**`Point.mult(a: number, i: Point)`** : a \* i

**`Point.div(i: Point, a: number)`** : i/a

**`Point.lenght(i: Point)`** : lenght of the vector using euclidean distance

## License

see [LICENSE](./LICENSE.md) <3

## Authors

Me and a lot of reading.
