import { createPlugin } from '../src'

test('create plugin without error', () => {
	const point = 'point'
	const plugin = createPlugin([
		{
			point,
			deps: {},
			factory: () => 'plugin',
		},
	])

	expect(plugin[0]).toBeDefined()
})
