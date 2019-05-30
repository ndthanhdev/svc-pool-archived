import { createPoint } from '../src/index'

test('create point without error', () => {
  const point = createPoint('a-point')
  expect(point).toBeDefined()
})
