const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('vendor.css');

    const sharedConfig = {
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        resolve: { extensions: [ '.js' ] },
        module: {
            rules: [
                { test: /\.(png|woff|woff2|eot|ttf|svg)(\?.*$|$)/, use: 'url-loader?limit=100000' }
            ]
        },
        entry: {
            vendor: [
                'jquery',
                'bootstrap',
                'bootstrap/dist/css/bootstrap.min.css',
                'domain-task',
                'history',
            ]
        },
        output: {
            publicPath: '/dist/',
            filename: '[name].js',
            library: '[name]_[hash]'
        },
        plugins: [
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', JQuery: 'jquery', Tether: "tether", "window.Tether": "tether", Popper: ['popper.js', 'default'] }),
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: { path: path.join(__dirname, 'wwwroot', 'dist') },
        module: {
            rules: [
                {
                    test: /\.css(\?|$)/, use: isDevBuild ? ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
                                                         : ['style-loader', MiniCssExtractPlugin.loader, 'css-loader?minimize', 'postcss-loader']
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            }),
            new webpack.DllPlugin({
                path: path.join(__dirname, 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new UglifyJSPlugin()
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: { mainFields: ['main'] },
        output: {
            path: path.join(__dirname, 'ClientApp', 'dist'),
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                { test: /\.css(\?|$)/, use: isDevBuild ? 'css-loader' : 'css-loader?minimize' }
            ]
        },
        entry: { vendor: ['aspnet-prerendering', 'react-dom/server'] },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'ClientApp', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
};
