const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

console.log("__dirname : "+__dirname);
module.exports = {
  mode: "development",
  devtool: 'eval-source-map',
  output: {
    chunkFilename: '[name].[chunkhash].js',
    filename: "[name].js",
    publicPath: "/",
    path: path.join(__dirname, "dist"),
  },
  entry: {
    index: path.join(__dirname, "./src/demo/page/index.ts"),
  },
  optimization: {
    minimize: false,
  },
  devServer: {
    open: !!process.env.OPEN,
    allowedHosts: 'all',
    hot: false,
    port: 9080
  },
  module: {
    rules: [
      {
        test: /\.(m|j|t)s$/,
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
              replaceAttrValues: { "#000": "{props.color}" },
              template: require("../../aptero_hub/hubs-wip/src/aptero/module/microsoft/react-components/hubs/react-components/icons/IconTemplate"),
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
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: true } },
        ],
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "./src/demo/page/index.html"),
      chunks: ["index"],
      chunksSortMode: "manual"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: "src/demo/assets/favicon.ico", to: "favicon.ico" }
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: "src/demo/assets/", to: "assets/" }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: 'css/index.css'
    })
  ],
  resolve: {
    alias: {
      "@root": path.join(__dirname,"./src/lib")
    },
    fallback: {
      'fs': false,
      'path': false, // ammo.js seems to also use path
    },
    extensions: ['.ts', '.js', '.json']
  }
};
