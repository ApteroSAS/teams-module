const path = require('path');
const webpack = require('webpack');
const PrettierPlugin = require("prettier-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const getPackageJson = require('./scripts/getPackageJson');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const libName = "axolotis-module-teams";

const {
    version,
    name,
    license,
    repository,
    author,
} = getPackageJson('version', 'name', 'license', 'repository', 'author');

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
        library: libName,
        libraryTarget: 'umd',
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
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    map: {
                        inline: false
                    }
                }
            })
        ],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.svg$/,
                include: [path.resolve(__dirname, "src")],
                use: [
                    {
                        loader: "@svgr/webpack",
                        options: {
                            titleProp: true,
                            replaceAttrValues: {"#000": "{props.color}"},
                            template: require("./src/lib/modules/hubs/react-components/icons/IconTemplate"),
                            svgoConfig: {
                                plugins: {
                                    removeViewBox: false,
                                    mergePaths: false,
                                    convertShapeToPath: false,
                                    removeHiddenElems: false
                                }
                            }
                        }
                    },
                    "url-loader"
                ]
            },
            {
                test: /\.(scss)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            }
        ]
    },
    plugins: [
        new PrettierPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/index.css'
        }),
        new webpack.BannerPlugin(banner)
    ],
    externals: {
        'react-intl' : 'umd react-intl',
        react: {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'React',
            root: 'React',
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'ReactDOM',
            root: 'ReactDOM',
        },
        '@aptero/axolotis-player':'umd @aptero/axolotis-player',
    },
    resolve: {
        alias: {
            "@root": path.join(__dirname, "./src/lib")
        },
        fallback: {
            'url': false,
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    }
};
