import { createLoader } from '../src/create-loader'
import { createDefPool, registerSvcDefs, resolveDefPool } from '@svc-pool/core'
import { flatten } from 'ramda'

jest.mock('../src/env-utils', () => {
	return {
		isAMD: () => true,
		isES: () => false,
	}
})

declare module '@svc-pool/core/registry' {
	// eslint-disable-next-line jest/no-export
	export default interface Registry {
		'a-point-for-test': string[]
	}
}

test('load', async () => {
	const ps = createLoader().loadSvcDefs(['./test/assets/p1'])

	await Promise.all(ps)
		.then(svcDefs =>
			resolveDefPool(registerSvcDefs(createDefPool(), flatten(svcDefs))),
		)
		.then(svcPool => {
			expect(svcPool.getServices('a-point-for-test')).toStrictEqual([
				'a-service-for-test',
			])
		})
})
