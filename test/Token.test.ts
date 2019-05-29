import { createPoint } from "../src";

test('create point without error', () => {
  const point = createPoint('a-point')
  expect(point).toBeDefined()
})