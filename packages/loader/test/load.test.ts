import loader from '../src'
import '@plugin-pool/core/registry'

const BASE = './test/assets'

declare module '@plugin-pool/core/registry' {
	export interface ServiceResolutionTypes {
		'a-point-for-test': string[]
	}
}

test('load', done => {
	loader
		.load({
			pluginPaths: [`${BASE}/p1.js`],
		})
		.then(definitionPool => definitionPool.resolve())
		.then(pluginPool => {
			expect(pluginPool.getServices('a-point-for-test')).toStrictEqual([
				'a-service-for-test',
			])
		})
		.then(done)
})
