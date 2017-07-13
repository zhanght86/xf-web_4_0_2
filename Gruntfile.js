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
                        if (filepath.indexOf('module') > 0){
                            return "";
                        }else{
                            return '// Source: ' + filepath + '\n' +
                                src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                        }
                    },
                },
            },
            css: {
    //            cwd: 'app/css/home/',
                src: [
                    //'css/base.css','css/common.css','css/style.css',
                    //'css/home/back/*.css' ,
                    //'libs/tagEditor/css/jquery.tag-editor.css','libs/H_ui/static/h-ui/css/H-ui.css','libs/H_ui/static/h-ui/css/H-ui.reset.css','css/plugins/1.0.8/iconfont.css',
                    'app/css/home/nav.css','app/css/home/login.css','app/css/home/index.css','app/css/home/style_new.css',
                    'app/css/home/base.css','app/css/home/common.css','app/css/home/robotSetup.css','app/css/home/ng-style.css','app/css/home/addContent.css','app/css/home/chat.css',
                    //'css/plugins/base.css','css/plugins/common.css','css/plugins/common2.css'
                ],
                //src: ['app/css/home/*.css'] ,
                dest: 'app/dest/css/<%= pkg.name %>.css'
            }

        },
        cssmin: {
            css: {
                src: 'app/dest/css/<%= pkg.name %>.css',
                dest: 'app/dest/css/<%= pkg.name %>-min.css'
            }
        },
        //imagemin: {
        //    /* 压缩图片大小 */
        //    dist: {
        //        options: {
        //            optimizationLevel: 3 //定义 PNG 图片优化水平
        //        },
        //        files: [
        //            {
        //                expand: true,
        //                cwd: 'images/',
        //                src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
        //                dest: 'images/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
        //            }
        //        ]
        //    }
        //},
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
                    interrupt: true ,
                   //livereload:true
                }
            },
            css: {
                files: ['app/css/home/*.css'],
                tasks: ['concat:css', 'cssmin:css'],
                options: {
                    spawn: true,
                    //livereload: true ,
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
//grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-css');

    //grunt.registerTask('default', ['concat', 'uglify', 'cssmin']);
    grunt.registerTask('default', ['concat', 'newer:uglify', 'cssmin']);
    //grunt.registerTask('img', ['imagemin']);
};
