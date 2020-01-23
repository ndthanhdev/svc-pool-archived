import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: './src/index.ts',
	output: [
		{
			file: './dist/index.js',
			name: 'SvcPoolLoader',
			format: 'umd',
			globals: { '@svc-pool/core': 'SvcPoolCore' },
		},
		{
			file: './dist/index.mjs',
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
