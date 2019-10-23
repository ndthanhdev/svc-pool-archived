import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: './src/index.ts',
	output: {
		dir: './dist',
		name: '@plugin-pool/react',
		format: 'umd',
		globals: {
			'@plugin-pool/core': '@plugin-pool/core',
			react: 'React',
		},
	},
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
