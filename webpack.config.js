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
console.log(libName);

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
        splitChunks: {
            //https://webpack.js.org/plugins/split-chunks-plugin/
            chunks: 'async',
            //filename: 'library/[name].[fullhash].js',
            cacheGroups: {
                vendor: {
                    //each vendor has one async bundle
                    name : (module, chunks, cacheGroupKey) => {
                        try {
                            let modulePath = module.resourceResolveData.descriptionFileData.name
                            if(modulePath.startsWith("node_modules")){
                                modulePath.replace("node_modules/","");
                            }
                            return modulePath
                        }catch (e){
                            return "default";
                        }
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
                },
                {
                    from: "./node_modules/@aptero/axolotis-module-basic/build/library/*",
                    to: "library/"
                },
            ]
        }),
        new PrettierPlugin(),
        new webpack.BannerPlugin(banner)
    ],
    externals: {
        '@aptero/axolotis-player':'@aptero/axolotis-player',
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
