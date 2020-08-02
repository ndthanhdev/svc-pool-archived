module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	collectCoverage: true,
	rootDir: '../',
	collectCoverageFrom: ['src/**/*'],
	globals: {
		'ts-jest': {
			packageJson: 'package.json',
		},
	},
}
