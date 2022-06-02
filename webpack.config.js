const path = require('path');
const webpack = require('webpack');
const PrettierPlugin = require("prettier-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const CopyWebpackPlugin = require("copy-webpack-plugin");


const {
    version,
    name,
    license,
    author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

const libName = name;

const banner = `
  ${name} v${version}

  Copyright (c) ${author.replace(/ *<[^)]*> */g, " ")} and project contributors.

  This source code is licensed under the ${license} license found in the
  LICENSE file in the root directory of this source tree.
`;

module.exports = {
    mode: "production",
    devtool: process.env.DEVTOOL || 'source-map',
    performance: {
        maxEntrypointSize: 2 * 1000 * 1000,
        maxAssetSize: 2 * 1000 * 1000
    },
    entry: {
        index: path.join(__dirname, './src/lib/index.ts'),
    },
    output: {
        chunkFilename: '[name].[chunkhash].js',
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
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: Infinity,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    //name: 'library/'+libName+"/[name]",
                    // cacheGroupKey here is `commons` as the key of the cacheGroup
                    filename: '[name].[fullhash].js',
                    name : (module, chunks, cacheGroupKey) => {
                        return 'library/'+module.resourceResolveData.descriptionFileData.name
                    },
                }
            }
        },
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
                    from: "./src/lib/modules/microsoft/page/auth-start.html",
                    to: "library/@aptero/axolotis-module-teams/assets/auth-start.html"
                },
                {
                    from: "./src/lib/modules/microsoft/page/auth-end.html",
                    to: "library/@aptero/axolotis-module-teams/assets/auth-end.html"
                }]
        }),
        new PrettierPlugin(),
        new webpack.BannerPlugin(banner)
    ],
    externals: {
        '@aptero/axolotis-player':'umd @aptero/axolotis-player',
    },
    resolve: {
        alias: {
            "@root": path.join(__dirname, "./src/lib")
        },
        fallback: {
            'url': false,
        },
        extensions: ['.ts', '.js', '.json']
    }
};
