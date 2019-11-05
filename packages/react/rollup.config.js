import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: './src/index.ts',
	output: [
		{
			dir: './dist/index.js',
			name: '@plugin-pool/react',
			format: 'umd',
		},
		{
			dir: './dist/index.mjs',
			name: '@plugin-pool/react',
			format: 'esm',
		},
	],
	external: ['@plugin-pool/core', 'react'],
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
