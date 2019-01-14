'use strict';

const babel = require('rollup-plugin-babel');

module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'dist/index.cjs.js',
			format: 'cjs'
		},
		{
			file: 'dist/index.esm.js',
			format: 'esm'
		}
	],
	plugins: [
		babel({
			exclude: 'node_modules/**'
		})
	]
};
