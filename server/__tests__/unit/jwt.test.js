import { describe, expect, it } from "@jest/globals";
import { generateToken, verifyToken } from "../../src/utils/jwt.js";

describe("jwt utilities", () => {
	it("generates a verifiable token containing the payload", () => {
		const token = generateToken({ id: 123, role: "user" });
		expect(typeof token).toBe("string");
		const decoded = verifyToken(token);
		expect(decoded.id).toBe(123);
		expect(decoded.role).toBe("user");
		expect(decoded.exp).toBeGreaterThan(Math.floor(Date.now() / 1000));
	});

	it("throws when verifying a tampered token", () => {
		const token = generateToken({ id: 1, role: "user" });
		const tampered = `${token}garbage`;
		expect(() => verifyToken(tampered)).toThrow();
	});
});
