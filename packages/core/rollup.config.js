import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'

export default [
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
			typescript({
				tsconfig: './tsconfig.prod.json',
			}),
		],
	},
]
