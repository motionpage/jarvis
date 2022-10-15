import { useState } from "@preact/compat"
import Markup from "preact-markup"
import SearchButton from "../SearchButton/SearchButton"

import "./style.scss"

export default function Terminal({ logs }) {
	const [mouseX, setMouseX] = useState(0)
	const [started, setStarted] = useState(false)
	const [showActionButton, setShowActionButton] = useState(false)
	const [text, setText] = useState(null)

	function highlightStart({ clientX }) {
		setMouseX(clientX)
		setStarted(true)
	}

	function highlightEnd() {
		if (!started) return
		const text = window.getSelection().toString()
		if (text.length > 0) {
			setShowActionButton(true)
			setText(text.replace(/\s/g, "+"))
		} else resetState()
	}

	function resetState() {
		setShowActionButton(false)
		setText("")
	}

	return (
		<div className="terminal" onmousedown={highlightStart} onmouseup={highlightEnd}>
			{logs.map((log) => (
				<Markup trim={false} markup={`<div>${log}</div>`} />
			))}

			<div className="buttons-bar" style={{ opacity: showActionButton ? 1 : 0 }}>
				<SearchButton google href={`https://www.google.com/search?q=${text}`} />
				<SearchButton stackoverflow href={`https://stackoverflow.com/search?q=${text}`} />
			</div>
		</div>
	)
}
