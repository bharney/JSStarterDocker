const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const bundleOutputDir = './wwwroot/dist';

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            publicPath: '/dist/' // Webpack dev middleware, if enabled, handles requests for this URL prefix
        },
        module: {
            rules: [
                { test: /\.ts(x?)$/, include: /ClientApp/, loaders: ['babel-loader', 'ts-loader?silent=true'], exclude: /node_modules/ },
                { test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        }
    });

    // Configuration for client-side bundle suitable for running in browsers
    const clientBundleOutputDir = './wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 'main-client': './ClientApp/boot-client.tsx' },
        module: {
            rules: [
                {
                    test: /\.scss$/, use: isDevBuild ? ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
                        : ['style-loader', MiniCssExtractPlugin.loader, 'css-loader?minimize', 'postcss-loader', 'sass-loader']
                }
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
                    postcss: () => [autoprefixer]
                }
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
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
            // Plugins that apply in production builds only
                new UglifyJSPlugin()
        ])
    });

    // Configuration for server-side (prerendering) bundle suitable for running in Node
    const serverBundleConfig = merge(sharedConfig(), {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': './ClientApp/boot-server.tsx' },
        module: {
            rules: [
                { test: /\.(jpg|png|woff|woff2|eot|ttf|svg)(\?|$)/, use: 'url-loader?limit=100000' }
            ]
        },
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