export default {
	testEnvironment: "node",
	transform: {},
	testMatch: ["<rootDir>/__tests__/**/*.test.js"],
	setupFiles: ["<rootDir>/__tests__/setup/env.js"],
	moduleNameMapper: {
		"^(\\.{1,2}/.*)\\.js$": "$1",
	},
	collectCoverageFrom: ["src/utils/**/*.js", "src/validation/**/*.js", "src/app.js"],
	coverageDirectory: "coverage",
	coverageReporters: ["text", "lcov", "json-summary"],
};
