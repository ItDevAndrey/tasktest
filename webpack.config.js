const glob = require("glob");
const webpack = require('webpack');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const mode =
  process.env.NODE_ENV === "development" ? "development" : "production";
const devtool = mode === "development" ? "eval-cheap-source-map" : false;
const stats = mode === "development" ? "errors-warnings" : { children: false };
const sass = require("sass");
const cssnano = require("cssnano");
const postcss = require('postcss');

module.exports = {
  mode: mode,
  devtool: devtool,
  entry: glob.sync("./src/js/**/*.js").reduce((acc, path) => {
    const entry = path.replace(/^.*[\\\/]/, "").replace(".js", "");
    acc[entry] = path;
    return acc;
  }, {}),
  output: {
    filename: "./assets/[name].js",
    path: path.resolve(__dirname),
  },
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, "src/styles/"),
      Helpers: path.resolve(__dirname, "src/styles/helpers/"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "./assets/[name].css",
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      rivets: 'rivets',
    }),
    new CopyPlugin([
      {
        from: "src/assets/**/*",
        to: "assets/",
        flatten: true,
      },
      {
        from: path.resolve(__dirname, "src/styles/sections/**/*"),
        to: path.resolve(__dirname, "assets/section-[name].min.css"),
        flatten: true,
        async transform(content, path) {
          const result = sass.renderSync({
            file: path,
          });
          const minifiedCss = await postcss([cssnano]).process(result.css.toString(), { from: undefined });
          return minifiedCss.css;
        },
      },
      {
        from: path.resolve(__dirname, "src/styles/components/**/*"),
        to: path.resolve(__dirname, "assets/component-[name].min.css"),
        flatten: true,
        async transform(content, path) {
          const result = sass.renderSync({
            file: path,
          });
          const minifiedCss = await postcss([cssnano]).process(result.css.toString(), { from: undefined });
          return minifiedCss.css;
        },
      },
    ]),

  ],
  stats: stats,
  module: {
    rules: [
      {
        test: /\.(sc|sa|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
};