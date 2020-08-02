module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	rootDir: '../../packages/core/',
	collectCoverageFrom: ['src/**/*'],
	globals: {
		'ts-jest': {
			tsConfig: 'packages/core/tsconfig.json',
		},
	},
}
