'use strict';

const path = require('path');
const stdLibBrowser = require('node-stdlib-browser');

let config;

const isCI =
	typeof process.env.CI !== 'undefined' && process.env.CI !== 'false';
const local =
	!isCI ||
	(isCI && typeof process.env.BROWSER_STACK_ACCESS_KEY === 'undefined');

const port = 0;

if (local) {
	config = {
		browsers: ['Chrome']
	};
} else {
	config = {
		hostname: 'bs-local.com',
		browserStack: {
			username: process.env.BROWSER_STACK_USERNAME,
			accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
			startTunnel: true,
			project: 'throttle-debounce',
			name: 'Automated (Karma)',
			build: 'Automated (Karma)'
		},
		customLaunchers: {
			'BS-Chrome': {
				'base': 'BrowserStack',
				'project': 'throttle-debounce',
				'build': 'Automated (Karma)',
				'browser': 'Chrome',
				'browser_version': '72',
				'name': 'Chrome',
				'os': 'Windows',
				'os_version': '7'
			},
			'BS-Edge': {
				'base': 'BrowserStack',
				'project': 'throttle-debounce',
				'build': 'Automated (Karma)',
				'browser': 'Edge',
				'browser_version': '15',
				'name': 'Edge',
				'os': 'Windows',
				'os_version': '10'
			},
			'BS-Firefox': {
				'base': 'BrowserStack',
				'project': 'throttle-debounce',
				'build': 'Automated (Karma)',
				'browser': 'Firefox',
				'browser_version': '65',
				'name': 'Firefox',
				'os': 'Windows',
				'os_version': '7'
			}
		},
		browsers: ['BS-Chrome', 'BS-Edge', 'BS-Firefox']
	};
}

module.exports = function (baseConfig) {
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
			devtool: 'inline-source-map',
			resolve: {
				fallback: {
					assert: stdLibBrowser.assert
				}
			},
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
