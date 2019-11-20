import { createSvcDef } from '@src/service-definition'

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
