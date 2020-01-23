import resolve from 'rollup-plugin-node-resolve'
import copy from 'rollup-plugin-copy'

export default [
	{
		input: './src/index.js',
		output: [
			{
				file: './dist/index.js',
				name: 'SvcPoolCore',
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
			copy({
				targets: [
					{
						src: './src/*.d.ts',
						dest: './dist',
					},
					{
						src: './src/def-pool/*.d.ts',
						dest: './dist/def-pool',
					},
					{
						src: './src/def-pool/exceptions/*.d.ts',
						dest: './dist/def-pool/exceptions',
					},
				],
			}),
		],
	},
]
