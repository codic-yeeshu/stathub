import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// In-memory user store used by the mocked db query builder.
const store = { users: [] };
let nextId = 1;

// Minimal stand-in for drizzle's chained query API. It only needs to support
// the call patterns used by authController.js: select().from().where(),
// insert().values().returning(), update().set().where().returning().
function buildSelect() {
	const q = {
		from: () => q,
		where: async () => store.users.slice(),
	};
	return q;
}

function buildInsert() {
	let pendingValues;
	const q = {
		values: (v) => {
			pendingValues = v;
			return q;
		},
		returning: async () => {
			const row = { id: nextId++, role: "user", metadata: {}, ...pendingValues };
			store.users.push(row);
			return [row];
		},
	};
	return q;
}

function buildUpdate() {
	let pendingSet;
	const q = {
		set: (v) => {
			pendingSet = v;
			return q;
		},
		where: () => q,
		returning: async () => {
			if (store.users[0]) Object.assign(store.users[0], pendingSet);
			return [store.users[0]];
		},
	};
	return q;
}

jest.unstable_mockModule("../../src/db/db.js", () => ({
	db: {
		select: () => buildSelect(),
		insert: () => buildInsert(),
		update: () => buildUpdate(),
	},
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

const app = createApp();

describe("POST /api/auth/signup", () => {
	beforeEach(() => {
		store.users = [];
		nextId = 1;
	});

	it("returns 201 and a JWT for a valid signup", async () => {
		const res = await request(app).post("/api/auth/signup").send({
			name: "Alice",
			email: "alice@example.com",
			password: "secret12",
		});

		expect(res.status).toBe(201);
		expect(res.body.user.email).toBe("alice@example.com");
		expect(res.body.user).not.toHaveProperty("password");
		expect(typeof res.body.token).toBe("string");
	});

	it("returns 400 when validation fails", async () => {
		const res = await request(app).post("/api/auth/signup").send({
			name: "A",
			email: "not-an-email",
			password: "x",
		});
		expect(res.status).toBe(400);
		expect(Array.isArray(res.body.error)).toBe(true);
	});

	it("returns 409 when email already exists", async () => {
		store.users = [{ id: 1, email: "alice@example.com", role: "user", isDeleted: false }];

		const res = await request(app).post("/api/auth/signup").send({
			name: "Alice",
			email: "alice@example.com",
			password: "secret12",
		});

		expect(res.status).toBe(409);
	});
});

describe("POST /api/auth/login", () => {
	it("returns 401 when no user is found", async () => {
		store.users = [];

		const res = await request(app).post("/api/auth/login").send({
			email: "missing@example.com",
			password: "anything",
		});
		expect(res.status).toBe(401);
	});

	it("returns 400 when validation fails", async () => {
		const res = await request(app).post("/api/auth/login").send({
			email: "not-an-email",
			password: "",
		});
		expect(res.status).toBe(400);
	});
});
