import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: './src/index.ts',
	output: [
		{
			file: './dist/index.js',
			name: '@svc-pool/loader',
			format: 'umd',
		},
		{
			file: './dist/index.mjs',
			name: '@svc-pool/loader',
			format: 'esm',
		},
	],
	external: ['@svc-pool/core'],
	plugins: [
		resolve(),
		commonjs({
			namedExports: {
				'@svc-pool/core': ['createDefinitionPool', 'Config'],
			},
		}),
		typescript({
			tsconfig: './tsconfig.prod.json',
		}),
	],
}
