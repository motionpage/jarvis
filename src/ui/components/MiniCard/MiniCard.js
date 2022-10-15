import If from "../utils/condition-component"
import "./style.scss"

export default function MiniCard({ color, title, status, note, progress }) {
	return (
		<div className={`mini ${color}`}>
			<div className="card-header">{title}</div>
			<h3>{status}</h3>
			<p className="note">{note}</p>
			<If
				condition={progress}
				then={
					<div className="progress-bar">
						<div className="progress" style={{ width: `${progress}%` }} />
					</div>
				}
			/>
		</div>
	)
}
