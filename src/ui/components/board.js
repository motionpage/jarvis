import { h, Component } from "preact"

import MiniCard from "./mini-card"
import Bundlelist from "./bundles-list"
import Terminal from "./terminal"
import Table from "./table"
import PerfBudget from "./perf-budget"

import { readableBytes } from "../helpers/utils"
import Nav from "./nav"

function formatMessage(data) {
	try {
		const { decode } = new TextDecoder("utf-8")
		decode(data)
	} catch {
		try {
			return JSON.parse(data)
		} catch {
			return data
		}
	}
}

function getTimestamp() {
	return new Date().getTime()
}

/**
 * for JARVIS DEVELOPER
 * Enforcing port is allowed and force_socket_port takes highest priority
 *
 */
const _params = new URLSearchParams(window.location.search)
const port = _params.get("force_socket_port") || document.location.port
const ws = new WebSocket(`ws://${document.location.hostname}:${port}`)

export default class Board extends Component {
	state = {
		assetsSize: 0,
		progress: {},
		time: 0,
		assets: [],
		errors: [],
		warnings: [],
		modules: {
			cjs: [],
			esm: [],
			mixed: [],
		},
		logs: [],
		performance: {},
		project: {},
	}

	componentDidMount() {
		ws.onopen = () => console.log("Connection established")

		ws.onmessage = ({ isTrusted, data }) => {
			if (!isTrusted) return
			const { project, stats, progress } = formatMessage(data)

			if (project) this.setState({ project })

			if (stats) {
				const { assets, assetsSize, errors, modules, success, time, warnings } = stats

				let logs = []
				if (errors?.length) logs = stats.errors
				if (warnings?.length) logs = stats.warnings
				if (success?.length) logs = stats.success

				this.setState({
					assets: assets || [],
					errors: errors || [],
					warnings: warnings || [],
					success: success || [],
					time: time / 1e3 || 0,
					modules: modules || [],
					//performance: stats?.performance || {},
					assetsSize: assetsSize || "NaN",
					logs,
				})
			}

			if (progress) {
				const { percent, msg } = progress
				if (msg?.toLowerCase() !== "idle") {
					this.setState({
						progress: percent,
						logs: [`<p>${msg}</p>`, `<p>${(percent * 100).toFixed(2)}%</p>`],
					})
				}
			}
		}

		ws.onclose = () => console.log("disconnected")
	}

	render(props, state) {
		return (
			<div className="board">
				<Nav {...state.project} />

				<div className="widget col-xs-12 col-md-4 col-lg-3">
					<MiniCard
						title="Compiler Status"
						note={`done in ${state.time} sec`}
						progress={state.progress.percentage * 100}
						status={state.progress.message || "Idle"}
						color="fire"
					/>

					<MiniCard
						title="Errors and Warnings"
						status={state.errors.length}
						note={
							state.warnings.length === 0
								? "and no warnings"
								: `and ${state.warnings.length} warnings`
						}
						color="berry"
					/>
					<MiniCard
						title="Total Assets Size"
						status={readableBytes(state.assetsSize)}
						note=""
						color="evening"
					/>
				</div>
				<div className="widget col-xs-12 col-md-4 col-lg-6">
					<Terminal logs={state.logs} />
				</div>
				<div className="widget  col-xs-12 col-md-4 col-lg-3">
					<Bundlelist assets={state.assets} />
				</div>

				<div className="widget col-xs-12 col-md-4 col-lg-6">
					<Table data={state.modules} />
				</div>
				<div className="widget col-xs-12 col-md-8 col-lg-6">
					<PerfBudget assetsSize={state.assetsSize} />
				</div>
			</div>
		)
	}
}
