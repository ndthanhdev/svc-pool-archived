import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import babel from 'rollup-plugin-babel'

export default {
	input: './src/index.js',
	output: [
		{
			file: './dist/index.js',
			name: 'SvcPoolReact',
			format: 'umd',
			globals: {
				react: 'React',
				'@svc-pool/core': 'SvcPoolCore',
			},
		},
		{
			file: './dist/index.mjs',
			name: 'SvcPoolReact',
			format: 'esm',
		},
	],
	external: ['@svc-pool/core', 'react'],
	plugins: [
		resolve(),
		babel({
			presets: ['@babel/preset-react'],
		}),
		commonjs({
			namedExports: {
				'@svc-pool/core': ['createDefinitionPool', 'Config'],
			},
		}),
		copy({
			targets: [
				{
					src: './src/*.d.ts',
					dest: './dist',
				},
				{
					src: './src/components/*.d.ts',
					dest: './dist/components',
				},
				{
					src: './src/hooks/*.d.ts',
					dest: './dist/hooks',
				},
			],
		}),
	],
}
