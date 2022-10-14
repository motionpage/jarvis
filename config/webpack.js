const { join, resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//const nodeExternals = require("webpack-node-externals");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const Jarvis = require("../src/server");

const babel = require("./babel");
const styles = require("./style");

const dist = join(__dirname, "../dist");

module.exports = env => {
  const isProd = process.env.NODE_ENV === "production";

  // Our style-loader chain
  const cssGroup = styles(isProd);

  // Base plugins
  const plugins = [];

  if (isProd) {
    //babel.plugins.push("babel-plugin-transform-react-remove-prop-types");
    plugins.push(new MiniCssExtractPlugin({ filename: "style.css" }));
  } else {
    // Add HMR client
    //entry = [
    //  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    //  entry
    //];
    // Add dev-only plugins
    plugins.push(
      new Jarvis({
        //packageJsonPath:
        //  "/Users/rados/Local Sites/motionpage/app/public/wp-content/plugins/motionpage/"
      })
    );
  }

  return {
    entry: {
      bundle: "./src/client/index.js"
    },
    //target: "web",
    watch: !isProd,
    mode: process.env.NODE_ENV,
    output: {
      path: join(__dirname, "../dist"),
      publicPath: "/",
      filename: "[name].js"
    },
    resolve: {
      extensions: [".jsx", ".js", ".json", ".scss"],
      alias: {
        "@Assets": resolve(__dirname, "../src/assets"),
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat", // Must be below test-utils
        "react/jsx-runtime": "preact/jsx-runtime"
      }
    },
    plugins,
    //devtool: !isProd && "eval",
    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: "html-loader"
        },
        {
          test: /\.ico$/,
          use: "url-loader"
        },
        {
          test: /\.svg/,
          type: "asset/resource"
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource"
        },
        {
          test: /(\.css|\.scss)$/,
          use: isProd ? [MiniCssExtractPlugin.loader, ...cssGroup] : cssGroup
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-react", "@babel/preset-env"],
              plugins: [
                ["@babel/plugin-transform-runtime"],
                [
                  "@babel/plugin-transform-react-jsx",
                  {
                    pragma: "h",
                    pragmaFrag: "Fragment"
                  }
                ]
              ]
            }
          }
        }
      ]
    }
  };
};
