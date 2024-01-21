import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert { type: 'json' };
import tslib from 'tslib'

export default {
	input: 'src/index.ts',
	output: [
		{
			file: pkg.main,
			format: 'cjs'
		},
		{
			file: pkg.module,
			format: 'es'
		}
	],
	external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
	plugins: [
		typescript({ tslib: tslib })
	]
};
