// eslint-disable-next-line @typescript-eslint/no-var-requires
const base = require('../../configs/jest.config')

module.exports = {
	...base,
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
		},
	},
}
