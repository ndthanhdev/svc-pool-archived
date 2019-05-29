import { createPlugin, createPoint } from "../src";

test('create plugin without error', () => {
  const point = createPoint('point')
  const plugin = createPlugin([
    {
      deps: {},
      point,
      factory: () => 'plugin'
    }
  ])

  expect(plugin[0]).toBeDefined()
})