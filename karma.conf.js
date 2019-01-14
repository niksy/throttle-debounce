'use strict';

const path = require('path');
const minimist = require('minimist');

let config;

const args = minimist(process.argv.slice(2), {
	'default': {
		local: false
	}
});

const local = args.local;
const port = 9001;

if ( local ) {
	config = {
		browsers: ['Chrome'],
	};
} else {
	config = {
		customLaunchers: {
			'Chrome-CI': {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		browsers: [(process.env.TRAVIS ? 'Chrome-CI' : 'Chrome')]
	};
}

module.exports = function ( baseConfig ) {

	baseConfig.set(Object.assign({
		basePath: '',
		frameworks: ['qunit'],
		files: [
			'test/**/.webpack.js'
		],
		exclude: [],
		preprocessors: {
			'test/**/.webpack.js': ['webpack', 'sourcemap']
		},
		reporters: ['mocha'],
		port: port,
		colors: true,
		logLevel: baseConfig.LOG_INFO,
		autoWatch: false,
		client: {
			captureConsole: true
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		webpack: {
			mode: 'none',
			devtool: 'cheap-module-inline-source-map',
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: [{
							loader: 'babel-loader'
						}]
					}
				]
			}
		},
		singleRun: true,
		concurrency: Infinity
	}, config));

};
