'use strict';


module.exports = {
	input: 'index.js',
	output: [
		{
			file: 'index.cjs.js',
			format: 'cjs'
		},
		{
			file: 'index.esm.js',
			format: 'es'
		}
	]
};
