/*!
 * webpack-jarvis <https://github.com/zouhir/webpack-jarvis>
 *
 * Copyright (c) 2017, Zouhir C.
 * Licensed under the MIT License.
 */

const polka = require("polka");
const io = require("socket.io");
const { join } = require("path");
const http = require("http");
const sirv = require("sirv");

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const files = sirv(join(__dirname, ".."));
const server = http.createServer();

exports.init = (compiler, isDev) => {
  const app = polka({ server }).use(files);

  if (isDev) {
    app.use(webpackDevMiddleware(compiler, { publicPath: "/" }));
    app.use(
      webpackHotMiddleware(compiler, {
        heartbeat: 1e4, // 10s
        path: "/__webpack_hmr",
        reload: true,
      })
    );
  }
  return { http: app, io };
};
