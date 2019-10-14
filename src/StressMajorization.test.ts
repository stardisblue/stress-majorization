import StressMajorization from './StressMajorization';
import WeightFactory from './Weight';
import { DistanceFactory } from '.';
import Distance from './Distance';

test('Stress Majorization array', () => {
  const data: [number, number][] = [[0, 1], [0, 2], [1, 2]];
  const weight = () => 1;
  const stress = (i: [number, number], j: [number, number]) =>
    20 - Math.abs(i[0] - j[0]) - Math.abs(i[1] - j[1]);
  expect(
    StressMajorization(data, {
      weight,
      stress,
      toPoint: i => i,
      fromPoint: i => i
    })
  ).toEqual([[[-8.5, -16.5], [-9, 11], [18.5, 10.5]], [17.212692260742188]]);
});

test('stress Majorization object', () => {
  const data = [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }];
  const weight = () => 1;
  const stress = (i: any, j: any) =>
    20 - Math.abs(i.x - j.x) - Math.abs(i.y - j.y);

  expect(
    StressMajorization<{ x: number; y: number }>(data, {
      weight,
      stress,
      toPoint: ({ x, y }) => [x, y],
      fromPoint: ([x, y], n) => ({ ...n, x, y })
    })
  ).toEqual([
    [{ x: -8.5, y: -16.5 }, { x: -9, y: 11 }, { x: 18.5, y: 10.5 }],
    [17.212692260742188]
  ]);
});

test('stress Majorization object', () => {
  const data = { a: { x: 0, y: 1 }, b: { x: 0, y: 2 }, c: { x: 1, y: 2 } };
  const weight = () => 1;
  const stress = (i: any, j: any) =>
    20 - Math.abs(i.x - j.x) - Math.abs(i.y - j.y);

  expect(
    StressMajorization<
      { x: number; y: number },
      { [k: string]: { x: number; y: number } }
    >(data, {
      weight,
      stress,
      toPoint: ({ x, y }) => [x, y],
      fromPoint: ([x, y], n) => ({ ...n, x, y })
    })
  ).toEqual([
    { a: { x: -8.5, y: -16.5 }, b: { x: -9, y: 11 }, c: { x: 18.5, y: 10.5 } },
    [17.212692260742188]
  ]);
});
