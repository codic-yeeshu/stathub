import { beforeEach, describe, expect, it, jest } from "@jest/globals";

// Lightweight in-memory backing store. The mocked drizzle methods read and
// write here so a signup followed by a login can be exercised end-to-end.
const store = { users: [] };
let nextId = 1;

jest.unstable_mockModule("../../src/db/db.js", () => {
	let lastInsertValues;
	let lastUpdateValues;

	const builder = {
		select: () => ({
			from: () => ({
				// drizzle's eq() returns an opaque comparison object that we
				// can't introspect, so we just return every user and let the
				// controller's subsequent checks decide. The e2e flow only
				// looks up users by email, so this is fine.
				where: async () => store.users.slice(),
			}),
		}),
		insert: () => ({
			values: (v) => {
				lastInsertValues = v;
				return {
					returning: async () => {
						const row = {
							id: nextId++,
							role: "user",
							metadata: {},
							isDeleted: false,
							...lastInsertValues,
						};
						store.users.push(row);
						return [row];
					},
				};
			},
		}),
		update: () => ({
			set: (v) => {
				lastUpdateValues = v;
				return {
					where: () => ({
						returning: async () => {
							const target = store.users[0];
							if (target) Object.assign(target, lastUpdateValues);
							return [target];
						},
					}),
				};
			},
		}),
	};

	return { db: builder, pool: { end: jest.fn() } };
});

jest.unstable_mockModule("../../src/arcjet.js", () => ({
	httpArcjet: null,
	wsArcjet: null,
	securityMiddleware: () => (_req, _res, next) => next(),
	wsSecurityMiddleware: async () => ({ success: true }),
}));

const request = (await import("supertest")).default;
const { createApp } = await import("../../src/app.js");
const { verifyToken } = await import("../../src/utils/jwt.js");

const app = createApp();

describe("E2E: signup then login", () => {
	beforeEach(() => {
		store.users = [];
		nextId = 1;
	});

	it("a freshly signed-up user can log in with the same credentials", async () => {
		const credentials = {
			name: "Eve",
			email: "eve@example.com",
			password: "secret12",
		};

		const signup = await request(app).post("/api/auth/signup").send(credentials);
		expect(signup.status).toBe(201);
		expect(signup.body.user.email).toBe(credentials.email);

		const decoded = verifyToken(signup.body.token);
		expect(decoded.id).toBe(signup.body.user.id);

		const login = await request(app).post("/api/auth/login").send({
			email: credentials.email,
			password: credentials.password,
		});

		expect(login.status).toBe(200);
		expect(login.body.user.email).toBe(credentials.email);
		expect(typeof login.body.token).toBe("string");
	});

	it("login with the wrong password is rejected", async () => {
		await request(app).post("/api/auth/signup").send({
			name: "Eve",
			email: "eve@example.com",
			password: "secret12",
		});

		const res = await request(app).post("/api/auth/login").send({
			email: "eve@example.com",
			password: "wrongpass",
		});

		expect(res.status).toBe(401);
	});
});
