import sirv from "sirv"
import { resolve, dirname } from "path"
import polka from "polka"
import { createServer } from "http"
import { WebSocketServer } from "ws"
import { fileURLToPath } from "url"

import webpackDevMiddleware from "webpack-dev-middleware"
import webpackHotMiddleware from "webpack-hot-middleware"

const __dirname = dirname(fileURLToPath(import.meta.url))
const __public = resolve(__dirname, "public")

export default function initializeServer(compiler, isDev) {
	//const app = polka({ createServer }).use(files);
	const middlewares = polka().use(sirv(__public))

	if (isDev) {
		middlewares.use(webpackDevMiddleware(compiler, { publicPath: "/" }))
		middlewares.use(
			webpackHotMiddleware(compiler, {
				heartbeat: 1e4, // 10s
				path: "/__webpack_hmr",
				reload: true,
			})
		)
	}

	const server = createServer({}, middlewares.handler)
	const ws = new WebSocketServer({ server })

	return { server, ws }
}
