/*!
 * webpack-jarvis <https://github.com/zouhir/webpack-jarvis>
 *
 * Copyright (c) 2017, Zouhir C.
 * Licensed under the MIT License.
 */

const polka = require("polka");
const socket = require("socket.io");
const statics = require("serve-static");
const { join } = require("path");

const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const client = join(__dirname, "..");

exports.init = (compiler, isDev) => {
  const app = polka();
  app.use(statics(client));

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
  const http = app.server;
  return { http: app, io: socket(http) };
};
