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

:construction: **SOON&trade;** :construction: Using npm:

    $ npm install stress-majorization

:construction: **SOON&trade;** :construction: Using yarn:

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
    x: (i) => i[0],
    y: (i) => i[1],
    ignore: (_i, j, _iIdx, jIdx) => iIdx === jIdx,
    epsilon: Math.pow(10, -6)
    */
  }
);
```

> **:warning: Note** : in this example, points are named `i` and `j`, their indexes are `iIdx` and `jIdx`

### Custom datasets

> **:warning: Note**: `dataset` can be anything as long it is an array : `[a, b, c, ...]`, the iteration is done over indexes, using a classical `for(i = 0; i< length; i++)`. Differents datastructures can lead to unwanted sideeffects.

To allow custom data, you need to specify
`x` and `y` accessors

```js
const weight = () => 1; // example fill
const stress = () => 1; // not realcase

const customData = [{ x: 0, y: 0 }, { x: 1, y: 10 } /*, ...*/];

const result = StressMajorization(customData, {
  weight: weight,
  stress: stress,
  x: i => i.x,
  y: i => i.y
});
```

### Ignore pairs

By default `StressMajorization` is solved over all possible pairs of items in `data` (`O(n²`)), except if the pair is composed of the same item.
It is possible to skip pairs by passing an `ignore` function in the options.

```js
// ignoring same position nodes
const result = StressMajorization(data, {
  weight: weight,
  stress: stress,
  x: i => i.x,
  y: i => i.y,
  ignore: (i, j, iIdx, jIdx) => i.x === j.x && i.y === j.y
});
```

> **:warning: Note**: Be careful when defining custom a ignore function, iterating over a pair `(i, i)` (same point) can result in funny behaviour

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
const data = { a: [0, 0], b: [0, 1] }; // does not work, not continous natural numbers
const data = [];
data[0] = { x: 1, y: 1 };
data[5] = { x: 1, y: 10 }; // does not work either, missing index between 0..5
```

### Configuration

> `i` and `j` are items of the data array. They have the same type, information other that those accessible via coordinate accessors are also available.

```js
const options = {
  // weight between two points. The points I, J will be the items from the dataset
  weight: (i, j) => number,

  // Stress function, i, j represents items from the dataset
  stress: (i, j) => number,

  // accessor for x coordinate
  x: i => number, // default to (i) => i[0]

  // accessor for y coordinate
  y: i => number, // default to (i) => i[1]

  // will ignore stress on this pair if yields true, iIdx and jIdx are the position of i, j in the data array
  ignore: (i, j, iIdx, jIdx) => boolean, // default to (i, j, iIdx, jIdx) => iIdx === jIdx

  // Threshold of change between each iteration, if the change is less that epsilon, the aglorithm will stop and return the solution
  epsilon: number // default to Math.pow(10, -6)
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
>   y: (j: T) => number
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

MIT <3

## Authors

Me and a lot of reading.
