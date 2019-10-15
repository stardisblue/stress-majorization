import StressMajorization from './StressMajorization';

test('Stress Majorization array', () => {
  const data: [number, number][] = [[0, 1], [0, 2], [1, 2]];
  const weight = () => 1;
  const stress = (xi: number, yi: number, xj: number, yj: number) =>
    20 - Math.abs(xi - xj) - Math.abs(yi - yj);
  expect(
    StressMajorization(data, {
      weight,
      stress,
      toPoint: i => i,
      fromPoint: i => i
    })
  ).toEqual([[[-8.5, -16.5], [-9, 11], [18.5, 10.5]], [51.63807678222656]]);
});

test('stress Majorization object', () => {
  const data = [{ x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }];
  const weight = () => 1;
  const stress = (xi: number, yi: number, xj: number, yj: number) =>
    20 - Math.abs(xi - xj) - Math.abs(yi - yj);

  expect(
    StressMajorization<{ x: number; y: number }>(data, {
      weight,
      stress,
      toPoint: ({ x, y }) => [x, y],
      fromPoint: ([x, y], n) => ({ ...n, x, y })
    })
  ).toEqual([
    [{ x: -8.5, y: -16.5 }, { x: -9, y: 11 }, { x: 18.5, y: 10.5 }],
    [51.63807678222656]
  ]);
});

test('stress Majorization object', () => {
  const data = { a: { x: 0, y: 1 }, b: { x: 0, y: 2 }, c: { x: 1, y: 2 } };
  const weight = () => 1;
  const stress = (xi: number, yi: number, xj: number, yj: number) =>
    20 - Math.abs(xi - xj) - Math.abs(yi - yj);

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
    [51.63807678222656]
  ]);
});
