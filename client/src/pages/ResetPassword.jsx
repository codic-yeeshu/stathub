import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordUser } from "../api/auth";
import Button from "../components/Button";
import Input from "../components/Input";
import AuthLayout from "../layouts/AuthLayout";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!token) {
			setError("Invalid or missing reset token.");
			return;
		}

		if (!password || !confirmPassword) {
			setError("All fields are required.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			await resetPasswordUser(token, password);

			setSuccess(true);
			setTimeout(() => {
				navigate("/login");
			}, 3000);
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout title="Choose new password" subtitle="Secure your account with a new password">
			{success ? (
				<div className="flex flex-col gap-4 text-center">
					<div className="p-4 bg-(--color-surface-muted) rounded-lg border border-(--color-accent) text-(--color-foreground)">
						Password reset successfully! Redirecting to login...
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
						label="New Password"
						name="password"
						type="password"
						placeholder="••••••••"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value);
							setError("");
						}}
					/>
					<Input
						label="Confirm Password"
						name="confirmPassword"
						type="password"
						placeholder="••••••••"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.target.value);
							setError("");
						}}
					/>

					{error && <div className="text-red-500 text-sm mt-1">{error}</div>}

					<Button type="submit" isLoading={isLoading} className="mt-2 w-full">
						Reset password
					</Button>
				</form>
			)}
		</AuthLayout>
	);
}
