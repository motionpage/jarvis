const { join, resolve } = require("path");
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const Jarvis = require("../src/server");
const pkg = require("../package.json");

const babel = require("./babel");
const styles = require("./style");

const dist = join(__dirname, "../dist");

module.exports = env => {
  const isProd = process.env.NODE_ENV === "production";

  // Our style-loader chain
  const cssGroup = styles(isProd);

  // Our entry file
  const entry = "./src/client/index.js";

  // Base plugins
  const plugins = [];

  if (isProd) {
    babel.plugins.push("babel-plugin-transform-react-remove-prop-types");
    plugins.push(
      new ExtractTextPlugin({
        filename: "style.css",
        allChunks: false
      })
    );
  } else {
    // Add HMR client
    //entry = [
    //  "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    //  entry
    //];
    // Add dev-only plugins
    plugins.push(new webpack.HotModuleReplacementPlugin(), new Jarvis());
  }

  return {
    entry,
    target: "web",
    mode: process.env.NODE_ENV,
    output: {
      path: dist,
      publicPath: "/",
      filename: "bundle.js"
    },
    resolve: {
      extensions: [".jsx", ".js", ".json", ".scss"],
      alias: {
        react: "preact-compat",
        "react-dom": "preact-compat",
        "@Assets": resolve(__dirname, "../src/assets")
      }
    },
    devServer: {
      allowedHosts: "all",
      client: {
        logging: "info",
        overlay: {
          errors: true,
          warnings: false
        }
      },
      static: {
        directory: join(__dirname, "../dist")
      },
      devMiddleware: {
        publicPath: `/`,
        writeToDisk: true,
        stats: "errors-only"
      },
      headers: { "Access-Control-Allow-Origin": "*" },
      historyApiFallback: true,
      hot: true,
      onListening(devServer) {
        if (!devServer) throw new Error("webpack-dev-server is not defined");
        const { port } = devServer.server.address();
        process.stdout.write(
          `  Listening on port: ${chalk.green.bold(port)}\n`
        );
      }
    },
    plugins,
    devtool: !isProd && "eval",
    module: {
      rules: [
        {
          test: /\.(xml|html|txt|md)$/,
          use: "raw-loader"
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
          use: isProd
            ? ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: cssGroup
              })
            : cssGroup
        },
        {
          test: /\.jsx?$/,
          use: {
            loader: "babel-loader",
            options: babel
          }
        }
      ]
    }
  };
};
