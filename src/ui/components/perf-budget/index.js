import { h, Component } from "preact"
import If from "../utils/condition-component"
import memoize from "../../helpers/memoize"
import Table from "../table"
import "./style.scss"

const performanceConstants = [
	{ title: "Global Average", internet_speed: 0.4, rtt: 160 },
	{ title: "Cable", internet_speed: 5, rtt: 28 },
	{ title: "DSL", internet_speed: 1.5, rtt: 50 },
	{ title: "3G Slow", internet_speed: 0.4, rtt: 400 },
	{ title: "3G Basic", internet_speed: 1.6, rtt: 300 },
	{ title: "3G Fast", internet_speed: 1.6, rtt: 150 },
	{ title: "4G", internet_speed: 9, rtt: 170 },
	{ title: "LTE", internet_speed: 12, rtt: 70 },
	{ title: "Mobile Edge", internet_speed: 0.24, rtt: 840 },
	{ title: "2G", internet_speed: 0.28, rtt: 800 },
	{ title: "Dial Up", internet_speed: 0.05, rtt: 120 },
	{ title: "FIOS", internet_speed: 20, rtt: 4 },
]

const DOWNLOAD_TIME_THRESHOLD_SECONDS = 5

const calculatePerformance = memoize((assetsSizeInBytes) =>
	performanceConstants.map((datapoint) => {
		const assetsSizeInMB = assetsSizeInBytes / 1024 / 1024
		const bandwidthInMbps = datapoint.internet_speed
		const bandwidthInMBps = bandwidthInMbps / 8
		const rttInSeconds = datapoint.rtt / 1000

		const totalDownloadTime = assetsSizeInMB / bandwidthInMBps + rttInSeconds

		const isDownloadTimeOverThreshold = totalDownloadTime > DOWNLOAD_TIME_THRESHOLD_SECONDS
		const timeDifferenceToThreshold =
			(isDownloadTimeOverThreshold ? "+" : "-") +
			Math.abs(totalDownloadTime - DOWNLOAD_TIME_THRESHOLD_SECONDS).toFixed(2) +
			"s"

		return {
			title: datapoint.title,
			bandwidth: `${bandwidthInMbps}mbps`,
			downloadTime: `${totalDownloadTime.toFixed(2)}s`,
			rtt: `${datapoint.rtt}ms`,
			isDownloadTimeOverThreshold,
			timeDifferenceToThreshold,
		}
	})
)

export default class Chart extends Component {
	state = {
		speeds: [],
	}

	render({ assetsSize }) {
		const performanceDatapoints = calculatePerformance(assetsSize)

		return (
			<div className="budget unset">
				{performanceDatapoints.map((datapoint) => (
					<div className="item">
						<div className="info">
							<h5>
								{datapoint.title} <span>{datapoint.rtt} RTT</span>
							</h5>
							<div className="values">
								<label>{datapoint.bandwidth}</label>
								<div className="time">{datapoint.downloadTime}</div>
								<If
									condition={datapoint.isDownloadTimeOverThreshold}
									then={<div className="high">{datapoint.timeDifferenceToThreshold}</div>}
									otherwise={<div className="low">{datapoint.timeDifferenceToThreshold}</div>}
								/>
							</div>
						</div>
					</div>
				))}
			</div>
		)
	}
}
