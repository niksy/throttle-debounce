module.exports = function ( grunt ) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.description %> | Author: <%= pkg.author %>, <%= grunt.template.today("yyyy") %> | License: <%= pkg.license %> | Original author: Ben Alman (http://benalman.com) | Original license: Dual licensed under the MIT and GPL licenses */\n'
		},

		concat: {
			dist: {
				options: {
					stripBanners: true,
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/<%= pkg.name %>.js': ['compiled/<%= pkg.main %>']
				}
			}
		},

		uglify: {
			dist: {
				options: {
					banner: '<%= meta.banner %>'
				},
				files: {
					'dist/<%= pkg.name %>.min.js': ['compiled/<%= pkg.main %>']
				}
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: '',
				push: false
			}
		},

		jscs: {
			main: {
				options: {
					config: '.jscsrc'
				},
				files: {
					src: [
						'<%= pkg.main %>',
						'lib/**/*.js'
					]
				}
			}
		},

		jshint: {
			main: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'<%= pkg.main %>',
					'lib/**/*.js'
				]
			}
		},

		browserify: {
			standalone: {
				options: {
					plugin: ['bundle-collapser/plugin'],
					transform: ['browserify-shim']
				},
				files: {
					'compiled/<%= pkg.main %>': ['lib/standalone/index.js']
				}
			}
		},

		connect: {
			test:{
				options: {
					open:true
				}
			}
		},

		'compile-handlebars': {
			test: {
				templateData: {
					bower: '../../../bower_components',
					compiled: '../../../compiled',
					assets: 'assets',
					main: '<%= pkg.main %>'
				},
				partials: 'test/manual/templates/partials/**/*.hbs',
				template: 'test/manual/templates/*.hbs',
				output: 'compiled/test/manual/*.html'
			}
		},

		copy: {
			test: {
				files:[{
					expand: true,
					cwd: 'test/manual/assets/',
					src: ['**'],
					dest: 'compiled/test/manual/assets/'
				}]
			}
		},

		concurrent: {
			options: {
				logConcurrentOutput: true
			},
			test: ['watch','connect:test:keepalive']
		},

		watch: {
			options: {
				spawn: false
			},
			hbs: {
				files: 'test/manual/**/*.hbs',
				tasks: ['compile-handlebars:test']
			},
			browserify: {
				files: ['<%= pkg.main %>', 'lib/**/*.js'],
				tasks: ['browserify:standalone']
			}
		},

	});

	require('load-grunt-tasks')(grunt);

	grunt.registerTask('test', function () {
		var tasks = ['compile-handlebars:test','copy:test','browserify:standalone'];
		if ( grunt.option('watch') ) {
			tasks.push('concurrent:test');
		}
		grunt.task.run(tasks);
	});

	grunt.registerTask('stylecheck', ['jshint:main', 'jscs:main']);
	grunt.registerTask('default', ['stylecheck', 'browserify:standalone', 'concat', 'uglify']);
	grunt.registerTask('releasePatch', ['bump-only:patch', 'default', 'bump-commit']);
	grunt.registerTask('releaseMinor', ['bump-only:minor', 'default', 'bump-commit']);
	grunt.registerTask('releaseMajor', ['bump-only:major', 'default', 'bump-commit']);

};
