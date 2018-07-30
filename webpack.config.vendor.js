const path = require('path');
const ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;

module.exports = {
    mode: 'production',
    entry: {
        bundle: [
            'event-source-polyfill'
        ]
    },
    output: {
        path: path.join(__dirname, 'wwwroot', 'dist'),
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.css(\?|$)/, use:['style-loader', 'css-loader', 'postcss-loader']
            }
        ]
    },
    plugins: [
        new ReactLoadablePlugin({
            filename: path.join(__dirname, 'ClientApp', 'dist', 'react-loadable.json')
        })
    ]
};
