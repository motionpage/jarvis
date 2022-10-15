//import chalk from "chalk"
import { resolve, dirname } from "path"
import { fileURLToPath } from "url"

import webpack from "webpack"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
//import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
//import WebpackAssetsManifest from "webpack-assets-manifest"
import { ESBuildMinifyPlugin } from "esbuild-loader"

//import { createRequire } from "node:module"
//const require = createRequire(import.meta.url)

const isDev = process.env.NODE_ENV === "development"

//process.stdout.write(
//	`  ${chalk.yellow.bold(`MODE: ${process.env.NODE_ENV}`)}\n`
//);
//process.traceDeprecation = true;

const __dirname = dirname(fileURLToPath(import.meta.url))
const __src = resolve(__dirname, "src")

const common = {
	mode: process.env.NODE_ENV,
	context: __dirname,
	target: isDev ? "web" : "browserslist",
	infrastructureLogging: { level: "error" },
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
		//new ForkTsCheckerWebpackPlugin({
		//	async: isDev,
		//	typescript: { mode: "write-references" },
		//	logger: "webpack-infrastructure"
		//	//formatter: "codeframe", //?
		//}),
		new webpack.ProvidePlugin({ React: "preact" }),
		new MiniCssExtractPlugin({
			filename: isDev ? "[name].css" : "[name].[contenthash:8].css",
			chunkFilename: isDev ? "[id].css" : "[id].[contenthash:8].css",
			ignoreOrder: false,
		}),
		//new WebpackAssetsManifest({
		//	writeToDisk: true,
		//	output: "manifest.json",
		//	publicPath: "",
		//	entrypoints: true
		//})
	],
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: "html-loader",
			},
			{
				test: /\.svg/,
				type: "asset/resource",
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: "asset/resource",
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
					//jsxFactory: "Preact.createElement", // or Preact.h
				},
			},
		],
	},
	optimization: {
		//runtimeChunk: isDev
		//	? "single"
		//	: { name: entrypoint => `runtime-${entrypoint.name}` },
		//splitChunks: {
		//	chunks: "all",
		//	maxInitialRequests: 30,
		//	minSize: 80_000,
		//	automaticNameDelimiter: ".",
		//	cacheGroups: {
		//		vendor: {
		//			test: /[\\/]node_modules[\\/]/,
		//			name(module) {
		//				const moduleFileName = module
		//					.identifier()
		//					.split("/")
		//					.reduceRight(item => item);
		//				return `npm.${moduleFileName
		//					.replace(/\.js$/gim, "")
		//					.replace("@", "")}`;
		//			}
		//		}
		//	}
		//},
		minimizer: [isDev && new ESBuildMinifyPlugin({ css: true })].filter(Boolean),
	},
	performance: {
		hints: false,
	},
	experiments: {
		backCompat: false,
		cacheUnaffected: true,
	},
}

export default common
