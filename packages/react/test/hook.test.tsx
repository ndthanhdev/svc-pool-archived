import React from 'react'
import {
	createDefinitionPool,
	createPlugin,
	PluginPool,
} from '@plugin-pool/core'
import { mount } from 'enzyme'
import {
	usePluginPool,
	Provider,
	useServices,
	PluginPoolContextType,
} from '../src'
import { HookWrapper } from './utils'

declare module '@plugin-pool/core/registry' {
	export interface ServiceResolutionTypes {
		'test-point': any[]
	}
}

test('usePluginPool', done => {
	let actual: PluginPoolContextType
	const runner = () => {
		actual = usePluginPool()
	}

	let pool: PluginPool | null = null
	createDefinitionPool()
		.resolve()
		.then(r => {
			pool = r
			mount(
				<Provider value={pool}>
					<HookWrapper callback={runner} />
				</Provider>,
			)
		})
		.then(() => {
			expect(actual).toBe(pool)
		})
		.then(done)
})

test('useServices', async () => {
	const definitions = createDefinitionPool()
	const testPoint = 'test-point'

	const pluginOfManyPoint = createPlugin([
		{ point: testPoint, factory: () => 'service1' },
		{ point: testPoint, factory: () => 'service2' },
	])

	definitions.importPlugin(pluginOfManyPoint)

	const pool = await definitions.resolve()

	let actual
	const runner = () => {
		actual = useServices('test-point')
	}

	mount(
		<Provider value={pool}>
			<HookWrapper callback={runner} />
		</Provider>,
	)
	console.log(actual)

	expect(actual).toStrictEqual(['service1', 'service2'])

	expect(true).toBe(true)
})
