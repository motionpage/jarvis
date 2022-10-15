import Jarvis from "./src/index.js"

import chalk from "chalk"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

import webpack from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { ESBuildMinifyPlugin } from "esbuild-loader"
import { CleanWebpackPlugin } from "clean-webpack-plugin"
import FileManagerPlugin from "filemanager-webpack-plugin"
import { LicenseWebpackPlugin } from "license-webpack-plugin"

//import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
//import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

const isDev = process.env.NODE_ENV === "development"

if (isDev) {
	process.stdout.write(`  ${chalk.yellow.bold(`MODE: ${process.env.NODE_ENV}`)}\n`)
	process.traceDeprecation = true
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const __src = resolve(__dirname, "src")

const COPY_OPTS = { flat: false, preserveTimestamps: true, overwite: true }
const EXPORT_FOLDER = "export"
const PLUGIN_NAME = process.env.npm_package_name
const EXPORT_PATH = `${EXPORT_FOLDER}/${PLUGIN_NAME}`
const DESKTOP_MAC_OS = `${process.env.HOME}/Desktop/`
const ZIP = `-${process.env.npm_package_version.replaceAll(".", "")}.zip`

const config = {
	mode: isDev ? "development" : "production",
	context: __dirname,
	target: isDev ? "web" : "browserslist",
	infrastructureLogging: { level: "error" },
	devtool: isDev ? "eval" : false,
	// https://webpack.js.org/configuration/stats/
	stats: {
		preset: "errors-warnings",
		assets: false,
		colors: true,
		env: true,
		logging: "info",
		loggingDebug: [/jarvis/i],
	},
	entry: {
		main: "./src/ui/main.js",
	},
	resolve: {
		alias: {
			"@": `${__src}ui`,
			"@Assets": resolve(__src, "public/assets"),
			react: "preact-compat",
			"react-dom": "preact-compat",
		},
		extensions: [".js", ".jsx", ".ts", ".tsx"],
	},
	plugins: [
		isDev && new Jarvis(),
		new webpack.ProvidePlugin({ React: "preact" }),
		new MiniCssExtractPlugin({
			filename: isDev ? "[name].css" : "[name].[contenthash:8].css",
			chunkFilename: isDev ? "[id].css" : "[id].[contenthash:8].css",
			ignoreOrder: false,
		}),
		isDev && new CleanWebpackPlugin(),
		//new ForkTsCheckerWebpackPlugin({
		//	async: isDev,
		//	typescript: { mode: "write-references" },
		//	logger: "webpack-infrastructure"
		//	//formatter: "codeframe", //?
		//}),
		!isDev &&
			new LicenseWebpackPlugin({
				stats: { warnings: false, errors: true },
				outputFilename: "LICENSES",
				perChunkOutput: false,
				addBanner: false,
				unacceptableLicenseTest: (licenseType) => {
					const typesArray = [
						"Apache-2.0",
						"Apache-2.0 WITH LLVM-exception",
						"BSD-2-Claus",
						"BSD-3-Clause",
						"MIT",
						"ISC",
						"0BSD",
						"BSD-3-Clause-Clear",
					]
					return !typesArray.includes(licenseType)
				},
				handleUnacceptableLicense: (packageName, licenseType) => {
					process.stdout.write(
						`  ${chalk.red.bold(`${licenseType}:`)} ${chalk.green.bold(packageName)}\n`
					)
				},
				handleMissingLicenseText: (packageName) => {
					process.stdout.write(
						`  Cannot find license text for ${chalk.red.bold(`${packageName}`)}\n`
					)
				},
				licenseTextOverrides: {
					mistql: "Copyright (c) 2022 Evin Sellin",
				},
			}),
		!isDev &&
			new FileManagerPlugin({
				runTasksInSeries: true,
				events: {
					onEnd: [
						{
							delete: [
								EXPORT_FOLDER,
								`${PLUGIN_NAME}${ZIP}`,
								`${DESKTOP_MAC_OS}${PLUGIN_NAME}${ZIP}`,
							],
						},
						{ mkdir: [EXPORT_FOLDER, EXPORT_PATH] },
						{
							copy: [
								{ source: "dist", destination: `${EXPORT_PATH}/dist`, options: COPY_OPTS },
								{
									source: "LICENSES",
									destination: `${EXPORT_PATH}/LICENSES`,
									options: COPY_OPTS,
								},
								{ source: "LICENSE", destination: `${EXPORT_PATH}/`, options: COPY_OPTS },
								{ source: "*.{php,txt}", destination: EXPORT_PATH, options: COPY_OPTS },
								{ source: "core/", destination: `${EXPORT_PATH}/core`, options: COPY_OPTS },
							],
						},
						//{ delete: [`${EXPORT_PATH}/dist/**.LICENSE.txt`] },
						{
							archive: [
								{
									source: EXPORT_FOLDER,
									destination: `${PLUGIN_NAME}${ZIP}`,
									format: "zip",
									options: {
										gzip: true,
										gzipOptions: { level: 9 },
									},
								},
							],
						},
						{
							move: [
								{
									source: `${PLUGIN_NAME}${ZIP}`,
									destination: `${DESKTOP_MAC_OS}${PLUGIN_NAME}${ZIP}`,
								},
							],
						},
						{ delete: [EXPORT_FOLDER, `${PLUGIN_NAME}${ZIP}`] },
					],
				},
			}),
	].filter(Boolean),
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				type: "asset",
				parser: {
					// Conditions for converting to base64
					dataUrlCondition: {
						maxSize: 40 * 1024, // 40kb
					},
				},
				generator: {
					filename: "[contenthash][ext][query]",
				},
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
				type: "asset/resource",
			},
			{
				test: /.s?css$/,
				use: [
					isDev && MiniCssExtractPlugin.loader,
					{ loader: "css-loader", options: { sourceMap: isDev } },
					{ loader: "sass-loader", options: { sourceMap: isDev } },
				].filter(Boolean),
			},
			{
				test: /\.m?js/,
				type: "javascript/auto",
				resolve: {
					fullySpecified: false,
				},
			},
			{
				test: /\.jsx?$/,
				include: /src\/ui\/*/,
				exclude: /node_modules/,
				loader: "esbuild-loader",
				options: {
					loader: "jsx",
					target: "esnext",
					treeShaking: true,
				},
			},
		],
	},
	optimization: {
		runtimeChunk: "single",
		splitChunks: {
			chunks: "all",
			maxInitialRequests: 30,
			minSize: 80_000,
			automaticNameDelimiter: ".",
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name(module) {
						const moduleFileName = module
							.identifier()
							.split("/")
							.reduceRight((item) => item)
						return `npm.${moduleFileName.replace(/\.js$/gim, "").replace("@", "")}`
					},
				},
			},
		},
		minimizer: [isDev && new ESBuildMinifyPlugin({ css: true })].filter(Boolean),
	},
	output: {
		chunkFilename: "[id].[contenthash:8].js",
		filename: "[name].js",
		path: resolve(__dirname, "dist"),
		publicPath: `/`,
		clean: true,
	},
	performance: {
		hints: false,
	},
	experiments: {
		backCompat: false,
		cacheUnaffected: true,
	},
}

export default config

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
