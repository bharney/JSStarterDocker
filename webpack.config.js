const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const merge = require('webpack-merge');
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.ts(x?)$/, include: /ClientApp/, loaders: ['babel-loader?presets[]=es2015', 'awesome-typescript-loader?silent=true'] },
            ]
        },
        plugins: [new CheckerPlugin()]
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': './ClientApp/boot-client.tsx' },
        module: {
            rules: [
                { test: /(\.css|\.scss|\.sass)$/, use: isDevBuild ? ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'] : ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader', 'sass-loader'] }) },
                { test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader' },
                { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
                { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream' },
                { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
                { test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]' },
                { test: /\.(woff|ttf|eot|svg)(\?v=[a-z0-9]\.[a-z0-9]\.[a-z0-9])?$/, loader: 'url-loader?limit=100000' },
                { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/octet-stream" },
            ]
        },
        output: { path: path.join(__dirname, clientBundleOutputDir) },
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
                    postcss: () => [autoprefixer],
                }
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            //Plugins that apply in production builds only
            new ExtractTextPlugin('site.css'),
            //new webpack.optimize.AggressiveMergingPlugin(),
            //new webpack.optimize.UglifyJsPlugin({
            //      mangle: true,
            //      compress: {
            //        warnings: false, // Suppress uglification warnings
            //        pure_getters: true,
            //        unsafe: true,
            //        unsafe_comps: true,
            //        screw_ie8: true
            //      },
            //      output: {
            //        comments: false,
            //      },
            //      exclude: [/\.min\.js$/gi] // skip pre-minified libs
            //})
            //new HtmlWebpackPlugin({
            //    minify: {
            //        removeComments: true,
            //        collapseWhitespace: true,
            //        removeRedundantAttributes: true,
            //        useShortDoctype: true,
            //        removeEmptyAttributes: true,
            //        removeStyleLinkTypeAttributes: true,
            //        keepClosingSlash: true,
            //        minifyJS: true,
            //        minifyCSS: true,
            //        minifyURLs: true
            //    }
            //}),
            new webpack.optimize.UglifyJsPlugin(),
            //new CompressionPlugin()
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': './ClientApp/boot-server.tsx' },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            })
        ],
        output: {
            libraryTarget: 'commonjs',
            path: path.join(__dirname, './ClientApp/dist')
        },
        target: 'node',
        devtool: 'inline-source-map'
    });

    return [clientBundleConfig, serverBundleConfig];
};