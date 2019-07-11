const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { AngularCompilerPlugin } = require('@ngtools/webpack');
const webpackMerge = require('webpack-merge');

const commonConfig = require('./webpack.demo.common.js');

module.exports = webpackMerge(commonConfig, {

    mode: "development",

    output: {
        filename: '[name].js',
    },

    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new AngularCompilerPlugin({
            mainPath: 'src/main.ts',
            tsConfigPath: './tsconfig.demo.json',
            sourceMap: true,
            nameLazyFiles: true,
            skipCodeGeneration: true
        }),
        new webpack.DefinePlugin({ 'process.env.PRODUCTION': false }),
    ],

    devServer: {
        historyApiFallback: true,
        open: true,
        host: 'localhost',
        port: 9090,
        watchOptions: {
            ignored: [
                'node_modules',
                'dist',
                '**/*.spec.ts'
            ]
        }
    }
});