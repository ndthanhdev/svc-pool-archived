import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
	// registry
	{
		input: './registry/index.ts',
		output: {
			dir: './registry/dist',
			name: '@svc-pool/core-registry',
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
		output: [
			{
				file: './dist/index.js',
				name: '@svc-pool/core',
				format: 'umd',
			},
			{
				file: './dist/index.mjs',
				name: '@svc-pool/core',
				format: 'esm',
			},
		],
		plugins: [
			resolve(),
			commonjs(),
			typescript({
				tsconfig: './tsconfig.prod.json',
			}),
		],
	},
]
