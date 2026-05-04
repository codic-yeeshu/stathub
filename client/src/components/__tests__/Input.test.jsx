import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import Input from "../Input";

describe("<Input />", () => {
	it("renders the label and associates it with the input", () => {
		render(<Input label="Email" name="email" />);
		const input = screen.getByLabelText(/email/i);
		expect(input).toBeInTheDocument();
		expect(input).toHaveAttribute("name", "email");
	});

	it("renders an error message when error is provided", () => {
		render(<Input label="Email" name="email" error="Required" />);
		expect(screen.getByText("Required")).toBeInTheDocument();
	});

	it("forwards a ref to the underlying input", () => {
		const ref = createRef();
		render(<Input label="Email" name="email" ref={ref} />);
		expect(ref.current).toBeInstanceOf(HTMLInputElement);
	});

	it("invokes onChange when the user types", async () => {
		const onChange = vi.fn();
		render(<Input label="Email" name="email" onChange={onChange} />);
		await userEvent.type(screen.getByLabelText(/email/i), "hi");
		expect(onChange).toHaveBeenCalled();
	});
});
