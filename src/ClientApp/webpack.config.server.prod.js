const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            chunkFilename: "[name].[chunkhash].js",
            publicPath: '/public/', // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.ts(x?)$/, include: /ClientApp/, loaders: ['babel-loader', 'ts-loader?silent=true'], exclude: /node_modules/ },
                { test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        }
    });


    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        resolve: { mainFields: ['main'] },
        entry: {
            serverbundle: './src/boot-server.tsx',
            vendor: ['aspnet-prerendering', 'react-dom/server']
        },
        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: false // set to true if you want JS source maps
                }),
                new OptimizeCSSAssetsPlugin({})
            ]
        },
        module: {
            rules: [
                {
                    test: /\.(css|scss)(\?|$)/, use: isDevBuild ? ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
                        : ['style-loader', MiniCssExtractPlugin.loader, 'css-loader?minimize', 'postcss-loader', 'sass-loader']
                }
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
                noInfo: true,
                options: {
                    sassLoader: {
                        includePaths: [path.resolve('ClientApp', 'scss')]
                    },
                    context: '/',
                    postcss: () => [autoprefixer]
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: "[id].css"
            }),
            new webpack.ProvidePlugin({ $: 'jquery', jQuery: 'jquery', JQuery: 'jquery', Popper: ['popper.js', 'default'] }),
            new webpack.NormalModuleReplacementPlugin(/\/iconv-loader$/, require.resolve('node-noop')), // Workaround for https://github.com/andris9/encoding/issues/16
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            }),
            new LodashModuleReplacementPlugin({
                collections: true,
                coercions: true
            }),
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            //new WebpackBundleAnalyzer()
        ] : [
                // Plugins that apply in production builds only
                new ImageminPlugin({
                    pngquant: {
                        quality: '80-85'
                    }
                }),
                new UglifyJSPlugin(),
                new OptimizeCSSAssetsPlugin({}),
            ]),
        output: {
            libraryTarget: 'commonjs2',
            path: path.join(__dirname, 'public')
        },
        target: 'node',
        devtool: 'inline-source-map'
    });

    return [serverBundleConfig];
};