import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock the API layer so the page exercises form behaviour, not network.
const loginUser = vi.fn();
vi.mock("../../api/auth", () => ({
	loginUser: (...args) => loginUser(...args),
	googleAuthUser: vi.fn(),
}));

// Mock @react-oauth/google so we don't need a real provider in the tree.
vi.mock("@react-oauth/google", () => ({
	useGoogleLogin: () => () => {},
}));

// Mock useNavigate to observe redirects.
const navigate = vi.fn();
vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return { ...actual, useNavigate: () => navigate };
});

// Mock AuthContext - the real one has an unrelated bug we don't want to fix here.
const loginFn = vi.fn();
vi.mock("../../context/AuthContext", () => ({
	useAuth: () => ({ login: loginFn }),
}));

const Login = (await import("../Login")).default;

const renderPage = () =>
	render(
		<MemoryRouter>
			<Login />
		</MemoryRouter>,
	);

describe("<Login /> E2E flow", () => {
	beforeEach(() => {
		loginUser.mockReset();
		navigate.mockReset();
		loginFn.mockReset();
	});

	afterEach(() => {
		loginUser.mockReset();
	});

	it("submits the form and navigates home on success", async () => {
		loginUser.mockResolvedValue({ token: "tok", user: { id: 1, email: "a@b.com" } });

		renderPage();

		await userEvent.type(screen.getByLabelText(/email address/i), "a@b.com");
		await userEvent.type(screen.getByLabelText(/password/i), "secret12");
		await userEvent.click(screen.getByRole("button", { name: /^log in$/i }));

		await waitFor(() => {
			expect(loginUser).toHaveBeenCalledWith({ email: "a@b.com", password: "secret12" });
		});
		expect(loginFn).toHaveBeenCalledWith({ id: 1, email: "a@b.com" }, "tok");
		expect(navigate).toHaveBeenCalledWith("/");
	});

	it("shows the server error message when login fails", async () => {
		loginUser.mockRejectedValue(new Error("Invalid credentials"));

		renderPage();

		await userEvent.type(screen.getByLabelText(/email address/i), "a@b.com");
		await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
		await userEvent.click(screen.getByRole("button", { name: /^log in$/i }));

		expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
		expect(navigate).not.toHaveBeenCalled();
	});

	it("blocks submission when fields are empty", async () => {
		renderPage();

		await userEvent.click(screen.getByRole("button", { name: /^log in$/i }));

		expect(await screen.findByText(/all fields are required/i)).toBeInTheDocument();
		expect(loginUser).not.toHaveBeenCalled();
	});
});
