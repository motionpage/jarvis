import Jarvis from "./cjs"

test("should set options property", () => {
	const opts = {
		test: "hello",
	}
	const plugin = new Jarvis(opts)
	expect(plugin.options).toBe(opts)
})
