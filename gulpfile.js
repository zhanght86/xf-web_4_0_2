/**
 * @Author : MILES .
 * @Create : 2017/12/12.
 * @Module : gulp 执行文件自动化
 */

var gulp = require('gulp'),
    os = require('os'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),  // 合并
    gulpOpen = require('gulp-open'),
    uglify = require('gulp-uglify'),
    minifycss = require('gulp-minify-css'),//压缩css文件
    autoprefixer = require("gulp-autoprefixer"), // //给 CSS 增加前缀。解决某些CSS属性不是标准属性，有各种浏览器前缀的情况
    rename = require('gulp-rename'),//设置压缩后的文件名
    md5 = require('gulp-md5-plus'),
    rev = require("gulp-rev") ,     //- 对文件名加MD5后缀
    revCollector = require('gulp-rev-collector'),             //- 路径替换
    fileinclude = require('gulp-file-include'),
    clean = require('gulp-clean'),
    spriter = require('gulp-css-spriter'),
    base64 = require('gulp-css-base64'),
    webpack = require('webpack'),
    connect = require('gulp-connect'),
    smushit = require('gulp-smushit'), // 图片压缩  yahoo  效率高
    imagemin = require('gulp-imagemin'),//图片压缩  效率低
    pngcrush = require('imagemin-pngcrush'),
    notify = require('gulp-notify'),//提示信息
    shell = require("gulp-shell")   , //启动 shell
    proxy = require('http-proxy-middleware'), //反向代理
    gulp_webpack = require("gulp-webpack")  ; // gulp 分发任务给 webpack
    webpack = require("webpack") ,
    webpackConfig = require('./webpack.config.js');  // webpack
//mac chrome: "Google chrome",
var browser = os.platform() === 'linux' ? 'Google chrome' : (
    os.platform() === 'darwin' ? 'Google chrome' : (
        os.platform() === 'win32' ? 'chrome' : 'firefox'));
var pkg = require('./package.json');
gulp
//  图片压缩 上线使用 高效压缩图片
    .task('smushit', function () {
        return gulp.src('./app/assets/images/**/*')
            .pipe(smushit({
                verbose: true
            }))
            .pipe(gulp.dest('./dest/assets/images'));
    })
//  图片压缩 上线使用
    .task('imgmin', function() {
        return gulp.src('./app/assets/images/**/*')
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngcrush()]
            }))
            .pipe(gulp.dest('./dest/assets/images')) ;
            // .pipe(notify({ message: 'img task ok' }));
    })
//将图片拷贝 开发环境
    .task('copy:images', function (done) {
         gulp.src(['app/assets/images/**/*']).pipe(gulp.dest('dest/assets/images')).on('end', done);
    })
    .task('copy:imagestemp', function (done) {
        gulp.src(['app/assets/images/**/*']).pipe(gulp.dest('dest/images')).on('end', done);
    })

.task('concatcss', function() {
        gulp.src([
                './app/assets/css/home/nav.css',
                './app/assets/css/home/login.css',
                './app/assets/css/home/index.css',
                './app/assets/css/home/style_new.css',
                './app/assets/css/home/common.css',
                './app/assets/css/home/robotSetup.css',
                './app/assets/css/home/ng-style.css',
                './app/assets/css/home/addContent.css',
                './app/assets/css/home/chat.css',
        ])    //- 需要处理的css文件，放到一个字符串数组里
            .pipe(autoprefixer({
                browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],//last 2 versions- 主流浏览器的最新两个版本
                cascade: true,          //是否美化属性值 默认：true 像这样：
                remove:true //是否去掉不必要的前缀 默认：true
            }))
            .pipe(concat('xf.css'))
            .pipe(gulp.dest('dest/assets/css'))
            .pipe(rename({ suffix: '.min' }))
            .pipe(minifycss())
            // .pipe(rev())
            .pipe(gulp.dest('dest/assets/css'))
            // .pipe(rev.manifest())
            // .pipe(gulp.dest('./rev'));

    gulp.src([
        './app/assets/css/base.css',
        './app/assets/css/common.css',
        './app/assets/css/home/back/back_style.css',
    ])    //- 需要处理的css文件，放到一个字符串数组里
        .pipe(autoprefixer({
            browsers: ['last 2 versions','Safari >0', 'Explorer >0', 'Edge >0', 'Opera >0', 'Firefox >=20'],//last 2 versions- 主流浏览器的最新两个版本
            cascade: true,          //是否美化属性值 默认：true 像这样：
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(concat('xf-base.css'))
        .pipe(gulp.dest('dest/assets/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        // .pipe(rev())
        .pipe(gulp.dest('dest/assets/css'))
        // .pipe(rev.manifest())
        // .pipe(gulp.dest('./rev'));
    })
    // .task('rev', function() {
    //     gulp.src(['./rev/*.json', './dest/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    //     .pipe(revCollector())                                   //- 执行文件内css名的替换
    //     .pipe(gulp.dest('./dest/'));                     //- 替换后的文件输出的目录
    // })
// 用于在html文件中直接include文件
    .task('fileinclude:html', function (done) {
        gulp.src(['./app/static/**/*.html','./app/share/**/*.html'])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dest/static'))
        .on('end', done);
    })
    .task('fileinclude:css', function (done) {
        gulp.src([
            "./app/assets/css/plugins/**/*",
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dest/assets/css/plugins'))
        .on('end', done);
    })
    .task('fileinclude:js', function (done) {
        gulp.src([
            './app/assets/js/**/*',
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dest/assets/js'))
        .on('end', done);
    })
    .task('fileinclude:libs', function (done) {
        gulp.src([
            './app/assets/libs/**/*'
        ])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dest/assets/libs'))
        .on('end', done);
    })
    .task('clean', function (done) {
        gulp.src(['./dest'])
            .pipe(clean())
            .on('end', done);
    })
gulp.task('watch-module', function(done) {
    watchPath = {
        img : "./app/assets/images/**/*",
        css : "./app/assets/css/**/*",
        js : "./app/assets/js/**/*",
        libs : "./app/assets/libs/**/*",
        appjs : [
            "./app/entrance/*/js" ,
            "./app/static/**/*.js"
        ]
    } ;
    gulp.watch(watchPath.img,["copy:images"] ).on('end', done);
    gulp.watch(watchPath.css,["fileinclude:css","concatcss"]).on('end', done);
    gulp.watch(watchPath.js,["fileinclude:js"] ).on('end', done);
    gulp.watch(watchPath.libs,["fileinclude:libs"] ).on('end', done);
    // gulp.watch(watchPath.appjs,["copy:images"] ).on('end', done)
});
//使用connect启动一个Web服务器
//使用'http-proxy-middleware'作为反向代理
var host = {
    root : ['./dest'] ,
    port : 8001 ,
    proxy : [
        proxy('/api/authority',  {
            target: 'http://192.168.181.166:7005',
            changeOrigin:true
        }),
        proxy('/api/application/', {
            target: 'http://192.168.181.166:7006',
            changeOrigin:true
        }),
        proxy('/api/ms/', {
            target: 'http://192.168.181.166:7002',
            changeOrigin:true
        }),
        proxy('/api/analysis/', {
            target: 'http://192.168.181.166:7007',
            changeOrigin:true
        })
    ]
};
gulp.task('server', function() {
    connect.server({
        root: host.root,
        port: host.port,
        livereload: true,
        middleware: function(connect, opt) {
            return host.proxy
        }
    });
});
//发布
gulp.task('release', ['imgmin', 'fileinclude', 'md5:css', 'md5:js', 'open']);
//超高效发布
gulp.task('release-efficient', ['smushit', 'fileinclude', 'md5:css', 'md5:js', 'open']);
//开发
// gulp.task('dev', ['connect', 'copy:images', 'fileinclude', 'lessmin', 'build-js', 'watch', 'open']);
gulp.task('default', [ 'copy:images','copy:imagestemp','fileinclude:html','fileinclude:css','fileinclude:js','fileinclude:libs','concatcss']);