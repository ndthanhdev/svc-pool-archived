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
import { useSvcPool, useServices, SvcPoolContext } from '../dist'
import { HookWrapper } from './utils'

declare module '@svc-pool/core/registry' {
	// eslint-disable-next-line jest/no-export
	export default interface Registry {
		'test-point': any[]
	}
}

test('usePluginPool', async () => {
	const getValueProvidedByHook = (svcPool: ServicePool) => {
		let actual: ServicePool | undefined
		const runner = () => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
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
		any
	>(
		getValueProvidedByHook,
		({ actual, svcPool }) => expect(actual).toBe(svcPool),
	)

	await pipe(
		createDefPool,
		resolveDefPool,
		then(assert),
	)()
})

test('useServices', async () => {
	const pluginOfManyPoint = [
		createSvcDef({ point: 'test-point', factory: () => 'service1' }),
		createSvcDef({ point: 'test-point', factory: () => 'service2' }),
	]

	const getValueProvidedByHook = (svcPool: ServicePool) => {
		let actual: any[] | undefined
		const runner = () => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
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
		any
	>(
		getValueProvidedByHook,
		({ actual }) => {
			expect(actual).toStrictEqual(['service1', 'service2'])
		},
	)

	await pipe(
		createDefPool,
		defPool => registerSvcDefs(defPool, pluginOfManyPoint),
		resolveDefPool,
		then(assert),
	)()
})
