const requirejs = require('requirejs')
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
