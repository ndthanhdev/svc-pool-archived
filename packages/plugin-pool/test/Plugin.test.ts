import { createPlugin, createPoint } from '../src/index'

test('create plugin without error', () => {
  const point = createPoint('point')
  const plugin = createPlugin([
    {
      point,
      deps: {},
      factory: () => 'plugin',
    },
  ])

  expect(plugin[0]).toBeDefined()
})
