import StressMajorization from './StressMajorization';

const epsilon = [
  48.16012954711914,
  23.66357421875,
  11.973434448242188,
  5.980644702911377,
  2.9898386001586914,
  1.4948339462280273,
  0.7474081516265869,
  0.37370389699935913,
  0.18685282766819,
  0.09342575073242188,
  0.04671180993318558,
  0.02335711382329464,
  0.011679597198963165,
  0.0058394307270646095,
  0.002920650877058506,
  0.001460325438529253,
  0.0007289046188816428,
  0.0003642835945356637,
  0.0001830631517805159,
  0.00009193278674501926,
  0.00004478662594920024,
  0.000020974401195417158,
  0.000009084813427762128,
  0.0000034811796467693057,
  0.0000019073486328125,
  9.5367431640625e-7
];
test('Stress Majorization array', () => {
  const data: [number, number][] = [[0, 1], [0, 2], [1, 2]];
  const weight = () => 1;
  const stress = (xi: number, yi: number, xj: number, yj: number) =>
    20 / Math.hypot(xi - xj, yi - yj);
  expect(
    StressMajorization(data, {
      weight,
      stress,
      toPoint: i => i,
      fromPoint: i => i
    })
  ).toEqual([
    [
      [-2.65525221824646, -9.486884117126465],
      [-7.8316330909729, 9.831632614135742],
      [11.486883163452148, 4.6552510261535645]
    ],
    epsilon
  ]);
});

test('stress Majorization object', () => {
  const data = [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }];
  const weight = () => 1;
  const stress = (xi: number, yi: number, xj: number, yj: number) =>
    20 / Math.hypot(xi - xj, yi - yj);

  expect(
    StressMajorization<{ x: number; y: number }>(data, {
      weight,
      stress,
      toPoint: ({ x, y }) => [x, y],
      fromPoint: ([x, y], n) => ({ ...n, x, y })
    })
  ).toEqual([
    [
      { x: -2.65525221824646, y: -9.486884117126465 },
      { x: -7.8316330909729, y: 9.831632614135742 },
      { x: 11.486883163452148, y: 4.6552510261535645 }
    ],
    epsilon
  ]);
});

test('stress Majorization object', () => {
  const data = { a: { x: 0, y: 1 }, b: { x: 0, y: 2 }, c: { x: 1, y: 2 } };
  const weight = () => 1;
  const stress = (xi: number, yi: number, xj: number, yj: number) =>
    20 / Math.hypot(xi - xj, yi - yj);

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
    {
      a: { x: -2.65525221824646, y: -9.486884117126465 },
      b: { x: -7.8316330909729, y: 9.831632614135742 },
      c: { x: 11.486883163452148, y: 4.6552510261535645 }
    },
    epsilon
  ]);
});
