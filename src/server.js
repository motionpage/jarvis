import sirv from "sirv";
import { join } from "path";
import polka from "polka";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(import.meta.url);

import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

const files = sirv(join(__dirname, ".."));

export default function init(compiler, isDev) {
	//const app = polka({ createServer }).use(files);
	const middlewares = polka().use(files);

	if (isDev) {
		middlewares.use(webpackDevMiddleware(compiler, { publicPath: "/" }));
		middlewares.use(
			webpackHotMiddleware(compiler, {
				heartbeat: 1e4, // 10s
				path: "/__webpack_hmr",
				reload: true,
			})
		);
	}

	const server = createServer({}, middlewares.handler);
	const ws = new WebSocketServer({ server });

	return { server, ws };
}
