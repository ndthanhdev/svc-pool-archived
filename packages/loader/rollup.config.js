import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: './src/index.ts',
	output: [
		{
			file: './dist/index.js',
			name: '@plugin-pool/loader',
			format: 'umd',
		},
		{
			file: './dist/index.mjs',
			name: '@plugin-pool/loader',
			format: 'esm',
		},
	],
	external: ['@plugin-pool/core'],
	plugins: [
		resolve(),
		commonjs({
			namedExports: {
				'@plugin-pool/core': ['createDefinitionPool', 'Config'],
			},
		}),
		typescript({
			tsconfig: './tsconfig.prod.json',
		}),
	],
}
