const base = require('../../configs/jest.config')
const requirejs = require('requirejs')

module.exports = {
	...base,
	testEnvironment: 'jsdom',
	globals: {
		// simulate AMD env
		requirejs,
	},
}
