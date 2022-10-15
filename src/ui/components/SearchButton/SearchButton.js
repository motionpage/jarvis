import "./style.scss"

export default function SearchButton({ google, stackoverflow, href = "#" }) {
	const cls = Object.keys({ superlink: true, google, stackoverflow }).join(" ")
	return <a className={cls} href={href} target="_blank" rel="noopener" />
}
