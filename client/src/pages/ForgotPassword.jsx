import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordUser } from "../api/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

export default function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!email) {
			setError("Email is required.");
			return;
		}

		setIsLoading(true);
		setError("");
		setSuccess(false);

		try {
			await forgotPasswordUser(email);

			setSuccess(true);
		} catch (_err) {
			setError("We couldn't process your request right now. Please try again shortly.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout title="Reset password" subtitle="We'll send you reset instructions.">
			{success ? (
				<div className="flex flex-col gap-4 text-center">
					<div className="p-4 bg-(--color-surface-muted) rounded-lg border border-(--color-accent) text-(--color-foreground)">
						If an account exists for{" "}
						<span className="font-semibold text-(--color-accent)">{email}</span>, you will receive
						password reset instructions.
					</div>
					<Link to="/login">
						<Button variant="outline" className="w-full mt-4">
							Back to login
						</Button>
					</Link>
				</div>
			) : (
				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<Input
						label="Email address"
						name="email"
						type="email"
						placeholder="you@example.com"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setError("");
						}}
					/>

					{error && <div className="text-red-500 text-sm mt-1">{error}</div>}

					<Button type="submit" isLoading={isLoading} className="mt-2 w-full">
						Send instructions
					</Button>

					<div className="text-center mt-4">
						<Link
							to="/login"
							className="text-sm text-(--color-foreground) opacity-70 hover:opacity-100 hover:text-(--color-accent) transition-all"
						>
							&larr; Back to login
						</Link>
					</div>
				</form>
			)}
		</AuthLayout>
	);
}
