import Lopx from "./cjs";

test("should set options property", () => {
	const opts = {
		test: "hello",
	};
	const plugin = new Lopx(opts);
	expect(plugin.options).toBe(opts);
});
