'use strict';
module.exports = function (grunt) {

    // load all grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    var mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

    var cfg = {
        srcDir: 'source',
        buildDir: 'dist',
        demoDir: 'demo'
    };

    // project configuration
    grunt.initConfig({
        cfg: cfg,
        
        // watch
        watch: {
            options: {
                livereload: true
            },
            files: [
                '<%= cfg.srcDir %>/**/*.js',
                '<%= cfg.demoDir %>/**/*.js',
                '!<%= cfg.buildDir %>/*.js',
                '!<%= cfg.demoDir %>/dist/*.js',
                '!<%= cfg.demoDir %>/bower_components/**/*'
            ],
            tasks: ['jshint:source', 'clean:build', 'concat:build', 'uglify:build', 'copy']
        },

        // clean up files as part of other tasks
        clean: {
            build: {
                src: ['<%= cfg.buildDir %>/**']
            },
            demo: {
                src: ['<%= cfg.demoDir %>/dist/**']
            }
        },

        // prepare files for demo
        copy: {
            demo: {
                files: [{
                    expand: true,
                    src: ['<%= cfg.buildDir %>/*.js'],
                    dest: '<%= cfg.demoDir %>/'
                }]
            }
        },

        // jshint
        jshint: {
            options: {
                'jshintrc': true,
                reporter: require('jshint-stylish')
            },
            source: {
                files: {
                    src: ['<%= cfg.srcDir %>/**/*.js']
                }
            },
            demo: {
                files: {
                    src: [
                        '<%= cfg.demoDir %>/**/*.js',
                        '!<%= cfg.demoDir %>/bower_components/**/*'
                    ]
                }
            }
        },

        // concat
        concat: {
            build: {
                src: [
                    '<%= cfg.srcDir %>/main.js',
                    '<%= cfg.srcDir %>/helper.js',
                    '<%= cfg.srcDir %>/nestedSortableCtrl.js',
                    '<%= cfg.srcDir %>/nestedSortableHandlerCtrl.js',
                    '<%= cfg.srcDir %>/nestedSortableItemCtrl.js',
                    '<%= cfg.srcDir %>/uiNestedSortable.js',
                    '<%= cfg.srcDir %>/uiNestedSortableHandle.js',
                    '<%= cfg.srcDir %>/uiNestedSortableItem.js'
                ],
                dest: '<%= cfg.buildDir %>/angular-nested-sortable.js'
            }
        },

        // uglify
        uglify: {
            options: {
                preserveComments: 'some',
                mangle: false
            },
            build: {
                files: {
                    '<%= cfg.buildDir %>/angular-nested-sortable.min.js': ['<%= cfg.buildDir %>/angular-nested-sortable.js']
                }
            }
        },

        // connect
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                hostname: '0.0.0.0'
            },
            demo: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '')
                        ];
                    }
                }
            }
        },

        // open
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>/<%= cfg.demoDir %>/'
            }
        },

        // karma
        karma: {
            options: {
                configFile: 'karma.conf.js',
                autoWatch: true
            },

            single: {
                singleRun: true,
                browsers: ['PhantomJS']
            },

            continuous: {
                singleRun: false,
                browsers: ['PhantomJS', 'Firefox']
            }
        },

        // available tasks
        tasks_list: {
            options: {},
            project: {
                options: {
                    tasks: [
                        {name: 'build', info: 'Create a build of (tested) the source files'},
                        {name: 'webserver', info: 'Build the project, watch filechanges and start a webserver'},
                        {name: 'test', info: 'Runt tests'},
                        {name: 'test:continuous', info: 'Runt tests continuously'}
                    ]
                }
            }
        }
    });

    // default
    grunt.registerTask('default', ['tasks_list:project']);
    grunt.registerTask('build', ['jshint:source', 'karma:single', 'clean:build', 'concat:build', 'uglify:build', 'copy']);
    grunt.registerTask('webserver', ['build', 'open', 'connect:demo', 'watch']);
    grunt.registerTask('test', ['karma:single']);
    grunt.registerTask('test:continuous', ['karma:continuous']);
};
