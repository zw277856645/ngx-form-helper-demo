const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const webpackMerge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CleanCssWebpackPlugin } = require('@angular-devkit/build-angular/src/angular-cli-files/plugins/cleancss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const commonConfig = require('./webpack.demo.common.js');

module.exports = webpackMerge(commonConfig, {

    mode: "production",

    output: {
        filename: '[name].[hash].js',
    },

    module: {
        rules: [
            // 减小bundle文件大小
            {
                test: /\.js$/,
                loader: '@angular-devkit/build-optimizer/webpack-loader',
                options: { sourceMap: true }
            },
            {
                test: /\.js$/,
                exclude: /(ngfactory|ngstyle).js$/,
                enforce: 'pre',
                loader: 'source-map-loader'
            }
        ]
    },

    optimization: {
        noEmitOnErrors: true,
        minimizer: [
            new webpack.HashedModuleIdsPlugin(),
            new UglifyJSPlugin({
                sourceMap: true,
                cache: true,
                parallel: true,
                uglifyOptions: {
                    output: {
                        comments: false
                    },
                    compress: {
                        pure_getters: true,
                        passes: 3,
                        inline: 3
                    }
                }
            }),
            new CleanCssWebpackPlugin({
                sourceMap: true,
                test: (file) => /\.(?:css)$/.test(file),
            })
        ]
    },

    plugins: [
        new AngularCompilerPlugin({
            mainPath: 'src/main.ts',
            tsConfigPath: './tsconfig.demo.json',
            sourceMap: true,
            nameLazyFiles: false,
            skipCodeGeneration: false
        }),
        new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
        new CleanWebpackPlugin(),
        new webpack.DefinePlugin({ 'process.env.PRODUCTION': true })
    ]
});