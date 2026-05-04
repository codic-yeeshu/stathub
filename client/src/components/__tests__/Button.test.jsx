import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import Button from "../Button";

describe("<Button />", () => {
	it("renders children", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
	});

	it("shows the loading spinner when isLoading is true", () => {
		render(<Button isLoading>Submit</Button>);
		expect(screen.getByTitle("Loading")).toBeInTheDocument();
	});

	it("is disabled while loading", () => {
		render(<Button isLoading>Submit</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("is disabled when disabled prop is set", () => {
		render(<Button disabled>Submit</Button>);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("invokes onClick when clicked", async () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Go</Button>);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).toHaveBeenCalledTimes(1);
	});

	it("does not invoke onClick when disabled", async () => {
		const onClick = vi.fn();
		render(
			<Button onClick={onClick} disabled>
				Go
			</Button>,
		);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("applies the outline variant class", () => {
		render(<Button variant="outline">Outline</Button>);
		expect(screen.getByRole("button").className).toMatch(/border/);
	});
});
