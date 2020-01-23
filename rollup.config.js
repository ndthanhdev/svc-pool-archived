import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: {
		lib: './src/index.ts',
		bin: './src/bin/index.ts',
	},
	output: [
		{
			dir: './dist/',
			entryFileNames: '[name].cjs',
			format: 'cjs',
		},
	],
	plugins: [
		resolve(),
		commonjs({
			namedExports: {
				'ts-morph': ['ts'],
			},
		}),
		typescript({
			tsconfig: './tsconfig.prod.json',
		}),
	],
}
