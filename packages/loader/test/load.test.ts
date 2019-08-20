import load from '../src'
import "@plugin-pool/core/registry";

const TEST_SERVER = 'http://localhost:5000/'

declare module '@plugin-pool/core/registry' {
	export interface ServiceResolutionTypes {
		'a-point-for-test': string[]
	}
}

test('load', done => {
	load({
		pluginPaths: [`${TEST_SERVER}/p1.js`],
	})
		.then(pluginPool => Promise.all([pluginPool.resolve(), pluginPool]))
		.then(([_, pluginPool]) => {
			console.log(pluginPool.getServices('a-point-for-test'))
			expect(true).toBe(true)
		})
		.then(done)
})
