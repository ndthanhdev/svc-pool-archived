import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
	// registry
	{
		input: './registry/index.ts',
		output: {
			dir: './registry/dist',
			name: '@plugin-pool/core-registry',
			format: 'umd',
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './registry/tsconfig.json',
			}),
		],
	},
	//  core
	{
		input: './src/index.ts',
		output: {
			dir: './dist',
			name: '@plugin-pool/core',
			format: 'umd',
		},
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.prod.json',
			}),
		],
	},
]
