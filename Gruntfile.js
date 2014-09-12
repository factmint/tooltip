module.exports = function(grunt) {
	grunt.initConfig ({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			options: {
				base: '.'
			},
			dev: {
				options: {
					open: 'http://localhost:3000',
					port: 3000
				}
			},
			test: {
				options: {
					keepalive: false,
					port: 3001
				}
			}
		},
		qunit: {
			tests: {
				options: {
					httpBase: 'http://localhost:3001'
				},
				src: 'test/*.html'
			}
		},
		clean: {
			release: {
				src: ['dist/'],
			},
		},
		sass: {
			dev: {
				files: {
					'src/style/bubble-chart.css' : 'src/style/bubble-chart.scss'
				},
			},
			release: {
				files: {
					'temp/main.min.css' : 'src/style/bubble-chart.scss'
				},
				options: {
				  outputStyle: 'compressed',
				}
			}
		},
		autoprefixer: {
			release: {
				expand: true,
				flatten: true,
				src: 'temp/main.min.css',
				dest: 'dist/'
			}
		},
		concat: {
			release: {
				src: [
					'src/templates/open-module.txt',
					'src/scripts/helper/*.js',
					'src/scripts/plugins/*.js',
					'src/scripts/bubble-chart.js',
					'src/scripts/main.js',
					'src/templates/close-module.txt'
				],
				dest: 'temp/bundle.js',
			},
			snap: {
				src: [
					'bower_components/Snap.svg/dist/snap.svg-min.js',
					'temp/bundle.min.js'
				],
				dest: 'dist/main.min.js'
			}
		},
		'closure-compiler': {
			release: {
				closurePath: '/usr/local/opt/closure-compiler/libexec/',
				js: 'temp/bundle.js',
				jsOutputFile: 'temp/bundle.min.js',
				maxBuffer: 500,
				options: {
					language_in: 'ECMASCRIPT5_STRICT',
					//compilation_level: 'ADVANCED_OPTIMIZATIONS'
				}
			}
		},
		watch: {
			css: {
				files: ['src/style/*.scss'],
				tasks: ['sass'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: ['src/scripts/*.js'],
			}
		},
	});

	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-sass');	
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.loadNpmTasks('grunt-autoprefixer');

	grunt.registerTask('serve', ['sass', 'connect:dev', 'watch']);
	grunt.registerTask('test', ['sass', 'autoprefixer', 'closure-compiler:frontend', 'connect:test', 'qunit']);
	grunt.registerTask('release', ['clean:release', 'concat:release', 'closure-compiler:release', 'concat:snap', 'sass:release', 'autoprefixer:release']);

};

