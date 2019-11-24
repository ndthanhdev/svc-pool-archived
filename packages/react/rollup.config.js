import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: './src/index.ts',
	output: [
		{
			dir: './dist/index.js',
			name: 'SvcPoolReact',
			format: 'umd',
			globals: {
				react: 'React',
				'@svc-pool/core': 'SvcPoolCore',
			},
		},
		{
			dir: './dist/index.mjs',
			name: 'SvcPoolReact',
			format: 'esm',
		},
	],
	external: ['@svc-pool/core', 'react'],
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
