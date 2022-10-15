import { h, Component } from "preact"
import "./style.scss"

const SearchButton = ({ google, stackoverflow, href = "#" }) => {
	const cls = Object.values({ superlink: true, google, stackoverflow }).toString()
	return <a className={cls} href={href} target="_blank" rel="noopener" />
}

export default SearchButton
