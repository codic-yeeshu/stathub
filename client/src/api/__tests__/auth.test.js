import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock axios.create so api/auth.js gets a controllable client.
const mockPost = vi.fn();
vi.mock("axios", () => ({
	default: {
		create: () => ({ post: mockPost }),
	},
}));

const { loginUser, signupUser, googleAuthUser, forgotPasswordUser, resetPasswordUser } =
	await import("../auth.js");

describe("auth API client", () => {
	beforeEach(() => {
		mockPost.mockReset();
	});

	afterEach(() => {
		mockPost.mockReset();
	});

	it("loginUser POSTs credentials and returns response data", async () => {
		mockPost.mockResolvedValue({ data: { token: "abc", user: { id: 1 } } });

		const result = await loginUser({ email: "a@b.com", password: "x" });

		expect(mockPost).toHaveBeenCalledWith("/api/auth/login", {
			email: "a@b.com",
			password: "x",
		});
		expect(result).toEqual({ token: "abc", user: { id: 1 } });
	});

	it("signupUser POSTs the user data", async () => {
		mockPost.mockResolvedValue({ data: { token: "tok" } });

		await signupUser({ name: "A", email: "a@b.com", password: "secret12" });

		expect(mockPost).toHaveBeenCalledWith("/api/auth/signup", {
			name: "A",
			email: "a@b.com",
			password: "secret12",
		});
	});

	it("googleAuthUser POSTs the auth code", async () => {
		mockPost.mockResolvedValue({ data: { token: "tok" } });

		await googleAuthUser("google-code");

		expect(mockPost).toHaveBeenCalledWith("/api/auth/google", { code: "google-code" });
	});

	it("forgotPasswordUser POSTs the email", async () => {
		mockPost.mockResolvedValue({ data: { message: "ok" } });

		await forgotPasswordUser("a@b.com");

		expect(mockPost).toHaveBeenCalledWith("/api/auth/forgot-password", { email: "a@b.com" });
	});

	it("resetPasswordUser POSTs token and new password", async () => {
		mockPost.mockResolvedValue({ data: { message: "ok" } });

		await resetPasswordUser("token-123", "newpass12");

		expect(mockPost).toHaveBeenCalledWith("/api/auth/reset-password", {
			token: "token-123",
			newPassword: "newpass12",
		});
	});

	it("rethrows server-supplied error message when login fails", async () => {
		mockPost.mockRejectedValue({ response: { data: { error: "Invalid credentials" } } });

		await expect(loginUser({ email: "a@b.com", password: "x" })).rejects.toThrow(
			"Invalid credentials",
		);
	});

	it("falls back to default message when error response has no body", async () => {
		mockPost.mockRejectedValue(new Error("network down"));

		await expect(signupUser({})).rejects.toThrow("network down");
	});
});
