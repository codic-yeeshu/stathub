import { describe, expect, it, jest } from "@jest/globals";

// Stub modules that touch external services so importing the app stays cheap.
jest.unstable_mockModule("../../src/db/db.js", () => ({
	db: {},
	pool: { end: jest.fn() },
}));
jest.unstable_mockModule("../../src/arcjet.js", () => ({
	httpArcjet: null,
	wsArcjet: null,
	securityMiddleware: () => (_req, _res, next) => next(),
	wsSecurityMiddleware: async () => ({ success: true }),
}));

const request = (await import("supertest")).default;
const { createApp } = await import("../../src/app.js");

describe("GET /health", () => {
	const app = createApp();

	it("returns 200 with status ok", async () => {
		const res = await request(app).get("/health");
		expect(res.status).toBe(200);
		expect(res.body).toEqual({ status: "ok" });
	});
});

describe("GET /", () => {
	const app = createApp();

	it("returns the root greeting", async () => {
		const res = await request(app).get("/");
		expect(res.status).toBe(200);
		expect(res.text).toContain("Server is up");
	});
});
