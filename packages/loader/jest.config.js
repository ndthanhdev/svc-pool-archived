const base = require('../../configs/jest.config')
const requirejs = require('requirejs')

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
