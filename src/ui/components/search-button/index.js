import { h, Component } from "preact"
import "./style.scss"

const SearchButton = ({ google, stackoverflow, href = "#" }) => {
	const cls = Object.keys({ superlink: true, google, stackoverflow }).join(" ")
	return <a className={cls} href={href} target="_blank" rel="noopener" />
}

export default SearchButton
