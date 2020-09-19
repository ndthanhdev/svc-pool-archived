module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	collectCoverageFrom: ['src/**/*'],
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json',
		},
	},
}
