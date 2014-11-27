'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);


  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngAnnotate',
    'copy:dist',
    'cdnify',
    'uglify',
    'cssmin',
    'filerev',
    'usemin',
    'htmlmin'
  ]);


  // Define the configuration for all the tasks
  grunt.initConfig({
    src: {
      js: ['src/**/*.js'],
      jsTpl: ['dist/templates/**/*.js'],
      specs: ['test/**/*.spec.js'],
      scenarios: ['test/**/*.scenario.js'],
      indexHtml: ['src/index.html'],
      tpl: {
        app: ['src/app/**/*.tpl.html'],
        common: ['src/common/**/*.tpl.html']
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: '<%= src.indexHtml %>',
        ignorePath: /\.\.\//
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= src.js %>',
          '<%= src.jsTpl %>'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['<%= src.specs %>', '<%= src.scenarios %>']
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/styles/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
          }
        ]
      }
    },

    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= src.js %>'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['<%= src.specs %>', '<%= src.scenarios %>'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['src/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'src/{,*/}*.html',
          'src/{,*/}*.tpl.html',
          '.tmp/styles/{,*/}*.css',
          'src/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              require('connect-modrewrite')(['!(\\..+)$ /index.html [L]']),
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect().use('/fonts', connect.static('./bower_components/font-awesome/fonts')),
              connect.static('src')
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static('src')
            ];
          }
        }
      },
      dist: {
        options: {
          open: true,
          base: 'dist'
        }
      }
    },


    // Empties folders to start fresh
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              '.tmp',
              'dist/{,*/}*',
              '!dist/.git',
              '!dist/.git/',
              '!dist/.git/*',
              '!dist/lib',
              '!dist/lib/*',
              '!dist/Capfile',
              '!dist/config',
              '!dist/config/*',
              '!dist/.gitignore'
            ]
          }
        ]
      },
      server: '.tmp'
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          'dist/scripts/{,*/}*.js',
          'dist/styles/{,*/}*.css',
          'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'dist/styles/fonts/*'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= src.indexHtml %>',
      options: {
        dest: 'dist',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['dist/{,*/}*.html'],
      css: ['dist/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['dist', 'dist/images']
      }
    },


    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
//    cssmin: {
//       dist: {
//         files: {
//           'dist/styles/main.css': [
//             '.tmp/styles/{,*/}*.css'
//           ]
//         }
//       }
//    },
    // uglify: {
    //   dist: {
    //     files: {
    //       'dist/scripts/scripts.js': [
    //         'dist/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/img',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: 'dist/images'
          }
        ]
      }
    },

    svgmin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/assets/img',
            src: '{,*/}*.svg',
            dest: 'dist/images'
          }
        ]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: 'dist',
            src: ['*.html', 'app/{,*/}*.html'],
            dest: 'dist'
          }
        ]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [
          {
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: ['*.js', '!oldieshim.js'],
            dest: '.tmp/concat/scripts'
          }
        ]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['dist/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'src',
            dest: 'dist',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              '*.html',
              'app/{,*/}*.html',
              'common/{,*/}*.html',
              'assets/img/{,*/}*.{webp}',
              'fonts/*'
            ]
          },
          {
            expand: true,
            cwd: '.tmp/images',
            dest: 'dist/images',
            src: ['generated/*']
          },
          {
            expand: true,
            cwd: 'bower_components/font-awesome',
            src: 'fonts/*',
            dest: 'dist'
          }
        ]
      },
      styles: {
        expand: true,
        dest: '.tmp/styles/',
        src: ['src/styles/{,*/}*.css', 'src/common/directives/{,*/}*.css'],
        filter: 'isFile',
        flatten: true
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    }
  });


  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });


};
