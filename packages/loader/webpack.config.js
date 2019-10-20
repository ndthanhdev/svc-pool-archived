// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require('awesome-typescript-loader')
const path = require('path')
const R = require('ramda')
const merge = require('webpack-merge')

function getEnvName() {
	return process.env.NODE_ENV || 'development'
}

function createConstantConfigs() {
	return {
		entry: {
			'plugin-pool-loader': './src/index.ts',
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'dist'),
		},
		// Currently we need to add '.ts' to the resolve.extensions array.
		resolve: {
			extensions: ['.ts', '.tsx', '.js', '.jsx'],
		},
		devtool: 'source-map',
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'awesome-typescript-loader',
					options: {
						configFileName: 'tsconfig.prod.amd.json',
					},
				},
			],
		},
		plugins: [new CheckerPlugin()],
	}
}

const createMode = R.curry((envName, config) => {
	return merge(config, {
		mode: envName,
	})
})

const createModeFromEnv = createMode(getEnvName())

const createWebpackConfig = R.pipe(
	createConstantConfigs,
	createModeFromEnv,
)

module.exports = createWebpackConfig()
