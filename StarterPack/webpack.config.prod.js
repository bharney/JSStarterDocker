const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const bundleOutputDir = './wwwroot/dist';
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
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
            publicPath: '/dist/', // Webpack dev middleware, if enabled, handles requests for this URL prefix
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
        entry: {
            bundle: [
                'domain-task',
                'event-source-polyfill',
                'core-js',
                './ClientApp/boot-client.tsx'
            ],
            vendor: [
                'jquery',
                'bootstrap'
            ],
            critical: [
                'bootstrap/dist/css/bootstrap.min.css',
                '@fortawesome/fontawesome-svg-core/styles.css'
            ]
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
        output: { path: path.join(__dirname, clientBundleOutputDir) },
        plugins: [
            new CleanWebpackPlugin([
                path.join(__dirname, clientBundleOutputDir, '*'),
            ]),
            new CleanWebpackPlugin([
                path.join(__dirname, 'ClientApp', 'dist', '*.js')
            ]),
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
            new HtmlWebpackPlugin({
                template: "Views/Home/IndexTemplate.cshtml",
                filename: "../../Views/Home/Index.cshtml",
                inject: false,
                chunksSortMode: 'manual',
                chunks: ['critical', 'vendor', 'bundle']
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
            new ReactLoadablePlugin({
                filename: path.join(__dirname, 'ClientApp', 'dist', 'react-loadable.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            }),
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
            ])
    });

    return clientBundleConfig;
};