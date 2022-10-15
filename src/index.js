import { existsSync } from "fs"
import { resolve } from "path"
import initializeServer from "./server.js"
import { statsReporter } from "./utils/reporter.js"
import webpack from "webpack"
import importFrom from "import-from"

export default class Jarvis {
	constructor({ host, port, keepAlive, packagePath, watchOnly } = {}) {
		const currentDirectory = process.cwd()
		//console.clear()

		host ??= "localhost"
		port ||= parseInt(port || 1337, 10)
		keepAlive ??= Boolean(keepAlive)
		packagePath ??= currentDirectory
		watchOnly ??= true

		if (Number.isNaN(port)) {
			console.error(`[JARVIS] error: the specified port (${port}) is invalid. Reverting to 1337!`)
			port = 1337
		}

		if (packagePath && !existsSync(packagePath)) {
			console.warn(
				`[JARVIS] warning: the specified path (${packagePath}) does not exist. Falling back to ${currentDirectory}!`
			) //Fallback to cwd and warn
			packagePath = currentDirectory
		}

		this.options = { host, port, keepAlive, packagePath, watchOnly }
		this.pkg = importFrom(packagePath, "./package.json")
	}

	apply(compiler, compilers) {
		const isDevelopment = compiler.options.mode === "development"
		const { port, host, watchOnly } = this.options

		const reports = {
			stats: {},
			progress: {},
			project: {},
		}

		const { name, version, author: makers } = this.pkg
		const normalizedAuthor = parseAuthor(makers)
		reports.project = { name, version, makers: normalizedAuthor }

		let isServerRunning = false
		let isServerBooting = false
		let webSocket = null

		const bootServer = async () => {
			if (isServerRunning || isServerBooting) return
			isServerBooting = true
			console.log("booted")

			console.log("initializeServer")
			let { server, ws } = initializeServer(compiler, isDevelopment)

			ws.on("connection", function connection(socket) {
				webSocket = socket
				webSocket.send(
					Buffer.from(
						JSON.stringify({
							project: reports?.project ?? {},
							progress: reports?.progress ?? {},
							stats: reports?.stats ?? {},
						})
					).toString("utf8")
				)
			})

			await server.listen(port, host, (_) => {
				console.log(`[jarvis] Dashboard on: http://${host}:${port}`)
				server.emit("ready", null)
			})

			server.on("ready", () => {
				console.log("The server is running!")
				isServerRunning = true
				isServerBooting = false
				isServerRunning = true
			})
		}

		if (!watchOnly && !isServerRunning) {
			console.log("booting")
			bootServer()
		}

		compiler.hooks.watchRun.tap("jarvis", (c) => {
			if (watchOnly && !isServerRunning) {
				console.log("booting")
				bootServer()
			}
			console.log("watchRun")
			//isWatching = true
			return c.hooks.done.tap("jarvis", () => true)
		})

		compiler.hooks.run.tap("jarvis", (c) => {
			//isWatching = false
			console.log("run")
			return c.hooks.done.tap("jarvis", () => true)
		})

		compiler.hooks.done.tap("jarvis", (stats) => {
			if (!isServerRunning && !webSocket) return
			const jsonStats = stats.toJson({ chunkModules: true })
			jsonStats.isDev = isDevelopment
			reports.stats = statsReporter(jsonStats)
			webSocket?.send(Buffer.from(JSON.stringify({ stats: reports.stats })).toString("utf8"))
		})

		new webpack.ProgressPlugin((percent, msg) => {
			reports.progress = { percent, msg }
			if (!isServerRunning && !webSocket) return
			webSocket?.send(Buffer.from(JSON.stringify({ progress: reports.progress })).toString("utf8"))
		}).apply(compiler)
	}
}

function parseAuthor(author) {
	if (author?.name) return author
	if (typeof author === "string") {
		const authorsArray = authors(author)
		if (authorsArray.length > 0) return authorsArray[0]
	}
	return { name: "", email: "", url: "" }
}
