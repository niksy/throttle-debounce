'use strict';

const babel = require('rollup-plugin-babel');

module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'index.cjs.js',
			format: 'cjs',
			sourcemap: true
		},
		{
			file: 'index.esm.js',
			format: 'esm',
			sourcemap: true
		}
	],
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	]
};
