import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { logError, logIt, logWarn } from "../../src/utils/utils.js";

describe("logger helpers", () => {
	let logSpy;
	let warnSpy;
	let errorSpy;

	beforeEach(() => {
		logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
		warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
		errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		logSpy.mockRestore();
		warnSpy.mockRestore();
		errorSpy.mockRestore();
	});

	it("logIt forwards to console.log", () => {
		logIt("hello", "world");
		expect(logSpy).toHaveBeenCalled();
		const args = logSpy.mock.calls[0];
		expect(args.join(" ")).toContain("hello");
		expect(args.join(" ")).toContain("world");
	});

	it("logWarn forwards to console.warn", () => {
		logWarn("careful");
		expect(warnSpy).toHaveBeenCalled();
	});

	it("logError forwards to console.error", () => {
		logError("oops");
		expect(errorSpy).toHaveBeenCalled();
	});
});
