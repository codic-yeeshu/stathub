import { describe, expect, it } from "@jest/globals";
import { loginSchema, signupSchema } from "../../src/validation/auth.js";

describe("signupSchema", () => {
	it("accepts a valid payload", async () => {
		const result = await signupSchema.safeParseAsync({
			name: "Alice",
			email: "alice@example.com",
			password: "secret12",
		});
		expect(result.success).toBe(true);
	});

	it("rejects short names", async () => {
		const result = await signupSchema.safeParseAsync({
			name: "A",
			email: "a@b.com",
			password: "secret12",
		});
		expect(result.success).toBe(false);
	});

	it("rejects invalid email", async () => {
		const result = await signupSchema.safeParseAsync({
			name: "Alice",
			email: "not-an-email",
			password: "secret12",
		});
		expect(result.success).toBe(false);
	});

	it("rejects passwords shorter than 8 chars", async () => {
		const result = await signupSchema.safeParseAsync({
			name: "Alice",
			email: "a@b.com",
			password: "short",
		});
		expect(result.success).toBe(false);
	});

	it("rejects passwords longer than 15 chars", async () => {
		const result = await signupSchema.safeParseAsync({
			name: "Alice",
			email: "a@b.com",
			password: "thispasswordistoolong",
		});
		expect(result.success).toBe(false);
	});
});

describe("loginSchema", () => {
	it("accepts a valid payload", async () => {
		const result = await loginSchema.safeParseAsync({
			email: "alice@example.com",
			password: "anything",
		});
		expect(result.success).toBe(true);
	});

	it("rejects invalid email", async () => {
		const result = await loginSchema.safeParseAsync({
			email: "nope",
			password: "anything",
		});
		expect(result.success).toBe(false);
	});

	it("rejects empty password", async () => {
		const result = await loginSchema.safeParseAsync({
			email: "a@b.com",
			password: "",
		});
		expect(result.success).toBe(false);
	});
});
