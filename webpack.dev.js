//import chalk from "chalk";
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"
//import "dotenv/config";

//import webpack from "webpack";
import { merge } from "webpack-merge"
import common from "./webpack.common.js"

//import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin"

//const PLUGIN_NAME = process.env.npm_package_name;
//const HOST = process.env.DEV_URL;
//const PROTOCOL = process.env.DEV_PROTOCOL;
//const { CERT_PATH } = process.env;
//const HOME_DIR = process.env.HOME;

//if (!HOST || !PROTOCOL || !CERT_PATH) {
//	process.stdout.write(
//		`  Missing ${chalk.red.bold("DEV_URL")} environment variable\n`
//	);
//	process.stdout.write(
//		`  Clone & Rename ${chalk.green.bold(".env.example")} to ${chalk.green.bold(
//			".env"
//		)}\n`
//	);
//	process.exit(1);
//}

//if (PROTOCOL !== "http" && PROTOCOL !== "https") {
//	process.stdout.write(
//		`  ${chalk.red.bold("PROTOCOL is not http or https")}}\n`
//	);
//	process.exit(1);
//}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import Lopx from "./src/Lopx.js"

const config = merge(common, {
	mode: "development",
	devtool: "eval",
	plugins: [
		new Lopx(),
		//new ReactRefreshWebpackPlugin(),
		new CleanWebpackPlugin(),
	],
	//devServer: {
	//	allowedHosts: "all",
	//	client: {
	//		logging: "info",
	//		overlay: {
	//			errors: true,
	//			warnings: false
	//		}
	//	},
	//	devMiddleware: {
	//		publicPath: `/wp-content/plugins/${PLUGIN_NAME}/dist/`,
	//		writeToDisk: true,
	//		stats: "errors-only"
	//	},
	//	headers: { "Access-Control-Allow-Origin": "*" },
	//	historyApiFallback: true,
	//	host: HOST,
	//	hot: true,
	//	//open: ["/wp-admin/admin.php?page=react-plugin"],
	//	open: false,
	//	port: "auto", // 10009
	//	server: {
	//		type: PROTOCOL,
	//		options: {
	//			key: `${HOME_DIR}${CERT_PATH}${HOST}.key`,
	//			cert: `${HOME_DIR}${CERT_PATH}${HOST}.crt`
	//		}
	//	},
	//	static: false,
	//	watchFiles: ["./(inc|includes|core)/**/*.php", `${PLUGIN_NAME}.php`],
	//	onListening(devServer) {
	//		if (!devServer) throw new Error("webpack-dev-server is not defined");
	//		const { port } = devServer.server.address();
	//		process.stdout.write(`  Listening on port: ${chalk.green.bold(port)}\n`);
	//	}
	//},
	output: {
		chunkFilename: "[id].[contenthash:8].js",
		filename: "[name].js",
		path: resolve(__dirname, "dist"),
		publicPath: "/",
		clean: true,
	},
})

export default config
