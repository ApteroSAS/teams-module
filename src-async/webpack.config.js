const path = require('path');
const PrettierPlugin = require("prettier-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");


const libName = "@aptero/axolotis-module-teams-async";
console.log(libName);

module.exports = {
    mode: "production",
    devtool: process.env.DEVTOOL || 'source-map',
    performance: {
        maxEntrypointSize: 2 * 1000 * 1000,
        maxAssetSize: 2 * 1000 * 1000
    },
    entry: {
        index: path.join(__dirname, './src/index.ts'),
    },
    output: {
        chunkFilename: 'library/[name].[chunkhash].js',
        filename: '[name].js',
        path: path.join(__dirname, 'build'),
        library: {
            name: libName.split("/")[libName.split("/").length-1],
            type: 'umd2',//https://webpack.js.org/configuration/output/#outputlibrarytype
        },
        umdNamedDefine: true
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false, terserOptions: {
                    //https://github.com/terser/terser#minify-options
                    keep_classnames: true,
                    keep_fnames: true
                }
            })
        ],
    },
    module: {
        rules: [
            {
                test: /\.(js|ts)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "./src/microsoft/page/auth-start.html",
                    to: "library/@aptero/axolotis-module-teams/assets/auth-start.html"
                },
                {
                    from: "./src/microsoft/page/auth-end.html",
                    to: "library/@aptero/axolotis-module-teams/assets/auth-end.html"
                },
            ]
        }),
        new PrettierPlugin(),
    ],
    externals: {
        '@aptero/axolotis-player':'@aptero/axolotis-player',
    },
    resolve: {
        alias: {
            "@root": path.join(__dirname, "./src")
        },
        fallback: {
            'url': false,
        },
        extensions: ['.ts', '.js', '.json']
    }
};
