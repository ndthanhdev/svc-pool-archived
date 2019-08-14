import { load } from '../src'

const TEST_SERVER = 'http://localhost:5000/'

declare module 'plugin-pool/registry'{
	export interface ServiceResolutionTypes {
		"a-point-for-test": string[]
	}
}

test('load', done => {
	load({
		pluginPaths: [`${TEST_SERVER}/p1.js`],
	})
		.then(pluginPool => Promise.all([pluginPool.resolve(), pluginPool]))
		.then(([_, pluginPool]) => {
			pluginPool.getServices('a-point-for-test')
		})
})
