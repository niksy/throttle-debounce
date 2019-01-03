/* globals process:false */
/* eslint-disable no-process-env */

'use strict';

module.exports = function ( config ) {

	config.set({
		basePath: '',
		frameworks: ['browserify', 'qunit'],
		files: [
			'test/**/*.html',
			'test/**/*.js'
		],
		exclude: [],
		preprocessors: {
			'test/**/*.html': ['html2js'],
			'test/**/*.js': ['browserify']
		},
		reporters: ['mocha'],
		port: 9001,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: false,
		client: {
			captureConsole: true,
			mocha: {
				ui: 'bdd'
			}
		},
		browserConsoleLogOptions: {
			level: 'log',
			format: '%b %T: %m',
			terminal: true
		},
		browserify: {
			debug: true,
			transform: [
				['rollupify', { config: '.rollup.js', sourceMaps: true }],

			]
		},
		customLaunchers: {
			'Chrome-CI': {
				base: 'Chrome',
				flags: ['--no-sandbox']
			}
		},
		browsers: [(process.env.TRAVIS ? 'Chrome-CI' : 'Chrome')],
		singleRun: true,
		concurrency: Infinity
	});

};
