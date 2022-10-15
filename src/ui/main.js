import { h, render } from "preact"
import "./styles/index.scss"

import App from "./components/app.js"

let root

function init() {
	root = render(<App />, document.getElementById("lopx"), root)
}
init()

if (module.hot) module.hot.accept("./components/app.js", init)
