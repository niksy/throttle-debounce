'use strict';

const path = require('path');

let config;

const local =
	typeof process.env.CI === 'undefined' || process.env.CI === 'false';
const port = process.env.SERVICE_PORT;

if (local) {
	config = {
		browsers: ['Chrome']
	};
} else {
	config = {
		customLaunchers: {
			'Chrome-CI': {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		browsers: [!local ? 'Chrome-CI' : 'Chrome']
	};
}

module.exports = function(baseConfig) {
	baseConfig.set({
		basePath: '',
		frameworks: ['qunit'],
		files: ['test/**/.webpack.js'],
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
						use: [
							{
								loader: 'babel-loader'
							}
						]
					}
				]
			}
		},
		singleRun: true,
		concurrency: Infinity,
		...config
	});
};
