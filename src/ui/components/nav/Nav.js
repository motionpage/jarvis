import "./style.scss"

const defaultMakers = { name: "", email: "", url: "" }
function Nav({ name = "", version = "NaN", makers = defaultMakers }) {
	return (
		<ul className="nav">
			<li className="project">{name}</li>
			<li className="version">{version}</li>
		</ul>
	)
}

export default Nav
