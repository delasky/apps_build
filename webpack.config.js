// TODO: image loader?
// https://github.com/tcoopman/image-webpack-loader
(function () {

    'use strict';

    var webpack = require('webpack');
    var path = require('path');
    var _ = require('lodash');
    var fs = require('fs')

    var HtmlWebpackPlugin = require('html-webpack-plugin');
    var pkg = require('./package.json');
    var build_version;
    try {
        let build_version_path = path.resolve(process.env.WORKSPACE, 'build_version.txt');
        build_version = fs.readFileSync(build_version_path, 'utf-8');
    } catch (err) {
        console.log('could not read build version from file, falling back to package');
        build_version = 'DEV';
    }
    var new_version = build_version || _.get(pkg, 'version');
    console.log('build_version?', build_version);
    console.log('writing index.html with version', new_version);
    var paths = require('./ui_lib/paths.js');
    var CleanWebpackPlugin = require('clean-webpack-plugin');
    var WebpackIgnorePlugin = webpack.IgnorePlugin;
    var AutoDllPlugin = require('autodll-webpack-plugin');
    var CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

    module.exports = [
        {
            entry: ['babel-polyfill', './app/utils/dom4.min.js', './app/index.js'],
            output: {
                path: path.resolve(process.cwd(), 'dist'),
                filename: 'bundle.[hash:6].js',
                pathinfo: true
            },
            resolve: {
                unsafeCache: true,
                alias: {
                    react: path.resolve('./node_modules/react')
                }
            },
            cache: true,
            devtool: (build_version === 'DEV') ? 'source-map' : 'none',
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "babel-loader"
                            },
                            {
                                loader: 'eslint-loader',
                                options: {
                                    emitWarning: true,
                                    failOnError: true,
                                    outputReport: {
                                        filePath: 'eslint_report.html',
                                        formatter: require('./node_modules/eslint/lib/formatters/html.js')
                                    }
                                }
                            }
                        ],
                    },
                    {
                        test: /\.scss$/,
                        exclude: [
                            /node_modules/
                        ],
                        use: [
                            {
                                loader: 'style-loader'  // creates style nodes from JS strings
                            },
                            {
                                loader: 'css-loader',   // translates CSS into CommonJS
                                options: {
                                    modules: true,
                                    localIdentName: '[name]-[hash:base64:5]'
                                }
                            },
                            {
                                loader: 'postcss-loader',
                                options: {
                                    plugins: function () {
                                        return [
                                            require('autoprefixer'),
                                            require('postcss-camel-case')
                                        ];
                                    }
                                }
                            },
                            {
                                loader: "sass-loader"   // compiles Sass to CSS
                            }
                        ]
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    "process.env": {
                        NODE_ENV: (build_version === 'DEV') ? JSON.stringify('development') : JSON.stringify("production")
                    }
                }),
                new CaseSensitivePathsPlugin(),
                new CleanWebpackPlugin([path.resolve(__dirname, paths.BUILD_DIR)]),
                new webpack.optimize.UglifyJsPlugin({sourceMap: build_version === 'DEV'}),
                new HtmlWebpackPlugin({
                    template: 'app/index.html',
                    new_version: new_version
                }),
                ((build_version === 'DEV')) ?
                    new AutoDllPlugin({
                        inject: true,
                        watch: false,
                        debug: build_version === 'DEV',
                        filename: '[name]_[hash].js',
                        path: './dll',
                        entry: {
                            vendor: Object.keys(pkg.dependencies)
                        }
                    }) : () => {},
                new WebpackIgnorePlugin(/config.json$/),
            ]
        }
    ];

})();
