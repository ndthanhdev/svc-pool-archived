import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default [
	// registry
	{
		input: './src/index.ts',
		output: [
			{
				file: './dist/index.js',
				format: 'cjs',
			},
			{
				file: './dist/index.mjs',
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
