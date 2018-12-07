const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const merge = require('webpack-merge');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const WorkboxPlugin = require('workbox-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);

    // Configuration in common to both client-side and server-side bundles
    const sharedConfig = () => ({
        mode: isDevBuild ? 'development' : 'production',
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            filename: '[name].js',
            chunkFilename: "[name].js",
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
    const clientBundleOutputDir = '../wwwroot/dist';
    const clientBundleConfig = merge(sharedConfig(), {
        entry: {
            bundle: [
                'domain-task',
                'event-source-polyfill',
                'core-js',
                './src/boot-client.tsx'
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
                template: "../Views/Home/IndexTemplate.cshtml",
                filename: "../../Views/Home/Index.cshtml",
                inject: false,
                chunksSortMode: 'manual',
                chunks: ['critical', 'vendor', 'bundle']
            }),
            new WebpackPwaManifest({
                name: "JSStarter",
                short_name: "JSStarter",
                theme_color: "#343a40",
                background_color: "#343a40",
                display: "standalone",
                Scope: "/",
                start_url: "/",
                icons: [
                    {
                        src: "src/images/icons/icon-72x72.png",
                        sizes: "72x72",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-96x96.png",
                        sizes: "96x96",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-128x128.png",
                        sizes: "128x128",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-144x144.png",
                        sizes: "144x144",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-152x152.png",
                        sizes: "152x152",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-192x192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-384x384.png",
                        sizes: "384x384",
                        type: "image/png"
                    },
                    {
                        src: "src/images/icons/icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png"
                    }
                ],
                splash_pages: null,
                inject: false,
                filename: "manifest.json"
            }),
            new WorkboxPlugin.GenerateSW({
                swDest: "service-worker.js",
                clientsClaim: true,
                skipWaiting: true,
                runtimeCaching: [{
                    urlPattern: new RegExp('https://jsstarterapp.azurewebsites.net'),
                    handler: 'staleWhileRevalidate'
                }]
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
                filename: path.join(__dirname, 'public', 'react-loadable.json')
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