// eslint-disable-next-line @typescript-eslint/no-var-requires
const requirejs = require('requirejs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../../configs/jest.config')

requirejs.config({
	baseUrl: __dirname,
	nodeRequire: require,
})

module.exports = {
	...base,
	testEnvironment: 'jsdom',
	globals: {
		// simulate AMD env
		requirejs,
	},
}
