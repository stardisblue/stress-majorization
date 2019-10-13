# Changelog

## 2.0.0 (2019.10.13)

big performance update

### Features

- accept objects as datasets (retrieves index using `Objects.keys`)
- return an array containing `[result, epsilons]`, epsilons is an array containing the epsilon of an iteration
- has new parameter `maxIterations`, if is set to 0, will be ignored, otherwise, defines the maximum amount of iteration before stopping the algorithm

### THIS IS A BREAKING UPDATE

- output has changed

## 1.1.2 (2019.10.11)

- Removing dist folder from repository
- adding `dist` to file options

## 1.1.0 (2019.10.11)

Big update, please upgrade to be able to use custom datasets

BREAKING CHANGE:

- `x` and `y` accessors are not available anymore, they have been replaced with `fromPoint` and `toPoint`

## 1.0.1 (2019.10.10)

- fix: LICENSE MIT now for real
- prepare instead of build in package.json
- has now a homepage and repository
- is finally on npm
- has less :construction:

## 1.0.0 (2019.10.10)

First version :firework:

### Features:

- StressMajorization over data with custom accessors
- Settable weight and stress function
- Capacity to ignore pairs
- settable epsilon

- Distance helpers : (euclidean and square)
- DistanceFactory for iterating over custom data

- Weight helpers: (1, distance, distance^-1, distance^-2, e^-distance )
- WeightFactory

- Point object for (2d) vector operations

- Documentation README
- LICENSE MIT
- Typescript
- no dependencies
- .gitignore
