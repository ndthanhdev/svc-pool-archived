import React from 'react'
import {
	createDefPool,
	resolveDefPool,
	ServicePool,
	createSvcDef,
	registerSvcDefs,
} from '@svc-pool/core'
import { pipe, then, otherwise } from 'ramda'
import { mount } from 'enzyme'
import {
	useSvcPool,
	useServices,
	SvcPoolContext,
} from '../src'
import { HookWrapper } from './utils'

declare module '@svc-pool/registry' {
	export default interface Schema {
		'test-point': any[]
	}
}

test('usePluginPool', done => {
	const getValueProvidedByHook = (svcPool: ServicePool) => {
		let actual: ServicePool | undefined
		const runner = () => {
			actual = useSvcPool()
		}

		mount(
			<SvcPoolContext.Provider value={svcPool}>
				<HookWrapper callback={runner} />
			</SvcPoolContext.Provider>,
		)

		return { actual, svcPool }
	}

	const assert = pipe<
		ServicePool,
		ReturnType<typeof getValueProvidedByHook>,
		any,
		any
	>(
		getValueProvidedByHook,
		({ actual, svcPool }) => expect(actual).toBe(svcPool),
		done,
	)

	pipe(
		createDefPool,
		resolveDefPool,
		then(assert),
		otherwise(done.fail),
	)()
})

test('useServices', done => {
	const pluginOfManyPoint = [
		createSvcDef({ point: 'test-point', factory: () => 'service1' }),
		createSvcDef({ point: 'test-point', factory: () => 'service2' }),
	]

	const getValueProvidedByHook = (svcPool: ServicePool) => {
		let actual: any[] | undefined
		const runner = () => {
			actual = useServices('test-point')
		}

		mount(
			<SvcPoolContext.Provider value={svcPool}>
				<HookWrapper callback={runner} />
			</SvcPoolContext.Provider>,
		)

		return { actual }
	}

	const assert = pipe<
		ServicePool,
		ReturnType<typeof getValueProvidedByHook>,
		any,
		any
	>(
		getValueProvidedByHook,
		({ actual }) => {
			expect(actual).toStrictEqual(['service1', 'service2'])
		},
		done,
	)

	pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, pluginOfManyPoint),
		resolveDefPool,
		then(assert),
		otherwise(done.fail),
	)()
})
