module.exports = function (grunt) {     //wrapper  grunt 信息
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        beautify: {
            //中文ascii化，非常有用！防止中文乱码的神配置
            ascii_only: true
        } ,
        concat: {
            options: {
                //separator: ';\n'  //文件间分隔符
            },
            allInOne: { //所有JS文件全部合并成一份文件
                src: ['app/know*/**/*_module.js'],
                dest: 'app/dest/src-concated/js/<%= pkg.name %>_module.js'
            },
            othersInOne: {
                src: ['app/know*/**/*.js'],
                dest: 'app/dest/src-concated/js/<%= pkg.name %>.js',
                options: {
                    banner: "'use strict';\n",
                    process: function (src, filepath) {
                        if (filepath.indexOf('module') > 0)
                            return "";
                        else
                            return '// Source: ' + filepath + '\n' +
                                src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                    },
                },
            },
            css: {
    //            cwd: 'app/css/home/',
                src: ['app/css/home/*.css','app/'] ,
                dest: 'app/dest/css/<%= pkg.name %>.css'
            }

        },
        cssmin: {
            css: {
                src: 'app/dest/css/<%= pkg.name %>.css',
                dest: 'app/dest/css/<%= pkg.name %>-min.css'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            buildrelease: {
                options: {
                    mangle: false,//暂时不混淆，混淆可能导致js的命名问题，暂时还没有好的解决办法
                    compress: {
                        drop_console: true
                    },
                    report: "min" //输出压缩率，可选的值有 false(不输出信息)，gzip
                },
                files: [{
                    expand: true,
                    cwd: 'app/dest/src-concated/js', //js目录
                    src: '**/*.js', //所有js文件
                    dest: 'app/dest/release/js', //输出到此目录下
                    ext: '.min.js' //指定扩展名
                }]
            }
            // ,
            // buildsrc: { //按照原来的目录结构压缩所有JS文件
            //     options: {
            //         mangle: false,
            //         compress: {
            //             drop_console: true
            //         },
            //         report: "min" //输出压缩率，可选的值有 false(不输出信息)，gzip
            //     },
            //     files: [{
            //         expand: true,
            //         cwd: 'src', //js目录
            //         src: '**/*.js', //所有js文件
            //         dest: 'app/dest/src-min', //输出到此目录下
            //         ext: '.min.js' //指定扩展名
            //     }]
            // },
            // buildall: { //按照原来的目录结构压缩所有JS文件
            //     options: {
            //         mangle: false,
            //         compress: {
            //             drop_console: true
            //         },
            //         report: "min" //输出压缩率，可选的值有 false(不输出信息)，gzip
            //     },
            //     files: [{
            //         expand: true,
            //         cwd: 'src', //js目录
            //         src: '**/*.js', //所有js文件
            //         dest: 'app/dest', //输出到此目录下
            //         ext: '.min.js' //指定扩展名
            //     }]
            // }
        },
        watch: {
            javascript: {
                files: ['app/know*/**/*.js'],
                tasks: ['concat:allInOne', 'concat:othersInOne', 'uglify:buildrelease'],
                options: {
                    spawn: true,
                    interrupt: true
                }
            },
            css: {
                files: ['app/css/home/*.css'],
                tasks: ['concat:css', 'cssmin:css'],
                options: {
                    spawn: true,

                    interrupt: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.loadNpmTasks('grunt-css');

    //grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
    grunt.registerTask('default', ['concat', 'newer:uglify', 'cssmin']);
};
