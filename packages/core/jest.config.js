const base = require('../../configs/jest.config')

module.exports = {
	...base,
	moduleNameMapper: {
		'^@src/(.*)$': '<rootDir>/src/$1',
		'^@test/(.*)$': '<rootDir>/test/$1',
	},
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
		},
	},
}
