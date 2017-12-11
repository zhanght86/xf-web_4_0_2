/**
 * Created by miles on 2017/11/25.
 */
var webpack = require('webpack');
var path = require('path');
const source = __dirname + '/static/';
var HtmlWebpackPlugin = require('html-webpack-plugin');
var minimize = process.argv.indexOf('--minimize') !== -1;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // path: path.resolve(__dirname, 'dest'),
    entry: {
        polyfill: [
            'es5-shim',
            'es5-shim/es5-sham'
        ],
        app: [
            './app/index.js'
        ]
    },
    devtool : "source-map" ,
    output: {
        path: path.join(__dirname, 'dest'),
        filename: '[name].js',
        chunkFilename: '[name].[chunkhash].js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ["es2015"]
                },
                plugins: [
                    "transform-es3-property-literals",
                    "transform-es3-member-expression-literals",
                    "transform-es2015-modules-simple-commonjs"
                ],
                exclude: /node_modules/
            },

            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader"),
                exclude: /node_modules/
            },
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?name=img/[hash:8].[ext]&limit=1024' ,//hash:8,
                exclude: /node_modules/
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?name=font/[name].[ext]&limit=10000&minetype=application/font-woff',
                exclude: /node_modules/
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?name=font/[name].[ext]&limit=10&minetype=application/font-woff',
                exclude: /node_modules/
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?name=font/[name].[ext]&limit=10&minetype=application/octet-stream',
                exclude: /node_modules/
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=font/[name].[eot]',
                exclude: /node_modules/
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?name=font/[name].[svg]&limit=10&minetype=image/svg+xml',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'raw',
                exclude: /node_modules/
            }
        ],
        modulesDirectories: [
            'node_modules'
        ]
    },
    // resolve: {
    //     extensions: ['.js', '.json','.html'],
    //     alias: {
    //         'loginPath': resolve('../static/login')
    //     }
    // },
    // resolve: {
    //     extensions: ['.js']
    //     modules: [
    //         path.resolve(__dirname, 'node_modules')
    //     ]
    // },
    externals: {
        'jquery':'window.jQuery'
    },
    //本地服务器
    // devServer: {
    //     hot: true,
    //     inline: true,
    //     contentBase: '/dest/'
    // },
    plugins: [
        new HtmlWebpackPlugin({
            title: '主页面',
            filename: 'index.html',
            template: './app/index.html'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $:"jquery",
            jQuery:"jquery",
            "window.jQuery":"jquery"
        }) ,

        // 复制静态资源
        // new CopyWebpackPlugin(
        //     [
        //         {
        //             from: path.resolve(__dirname, 'app/assets'),
        //             to: path.resolve(__dirname, 'dest/assets')
        //         },
        //         {
        //             from: path.resolve(__dirname,'app/static'),
        //             to: path.resolve(__dirname,'dest/static'),
        //             toType : "dir" ,
        //             ignore:['.js']
        //         }
        //     ],
        //     {
        //         ignore: [],
        //         copyUnmodified: true,
        //         debug: "debug"
        //     }
        //  )
        // js  压缩
        // new webpack.optimize.UglifyJsPlugin({
        //     minimize: true,
        //     warnings: false,
        //     mangle: {
        //         except: ['$q', '$ocLazyLoad']
        //     },
        //     sourceMap: false
        // })
    ]
};