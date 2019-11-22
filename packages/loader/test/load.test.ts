import createLoader from '../src/create-loader'
import { createDefPool, registerSvcDefs, resolveDefPool } from '@svc-pool/core'
import { flatten } from 'ramda'

jest.mock('../src/env-utils', () => {
	return {
		isAMD: () => true,
		isES: () => false,
	}
})

declare module '@svc-pool/registry' {
	export default interface Schema {
		'a-point-for-test': string[]
	}
}

test('load', done => {
	const ps = createLoader().loadSvcDefs(['./test/assets/p1'])

	Promise.all(ps)
		.then(svcDefs => {
			console.log(svcDefs)

			return resolveDefPool(registerSvcDefs(createDefPool(), flatten(svcDefs)))
		})
		.then(svcPool => {
			expect(svcPool.getServices('a-point-for-test')).toStrictEqual([
				'a-service-for-test',
			])
		})
		.then(done)
		.catch(done.fail)
})
