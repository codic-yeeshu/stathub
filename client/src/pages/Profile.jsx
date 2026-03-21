import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Mock checking session
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		if (token && storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				console.error("Failed to parse user data", e);
			}
		}
		setIsLoading(false);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		navigate("/login");
	};

	if (isLoading) {
		return (
			<div className="flex h-[50vh] items-center justify-center">
				<div className="animate-pulse flex flex-col items-center gap-4">
					<div className="h-12 w-12 bg-(--color-surface-muted) rounded-full"></div>
					<div className="h-4 w-24 bg-(--color-surface-muted) rounded"></div>
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="max-w-md mx-auto mt-12 mb-12 bg-(--color-surface) border border-(--color-border) p-8 rounded-card text-center shadow-sm">
				<div className="mx-auto w-16 h-16 bg-(--color-accent-soft) text-(--color-accent) rounded-full flex items-center justify-center mb-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-8 w-8"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<title>Profile</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
						/>
					</svg>
				</div>
				<h1 className="text-2xl font-bold mb-2">Not Logged In</h1>
				<p className="text-(--color-foreground) opacity-70 mb-8">
					Please log in or create an account to view your profile and manage your data.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Link to="/login" className="flex-1">
						<Button className="w-full">Log in</Button>
					</Link>
					<Link to="/signup" className="flex-1">
						<Button variant="outline" className="w-full">
							Sign up
						</Button>
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto mt-8 mb-12">
			<h1 className="text-3xl font-bold mb-6">Your Profile</h1>

			<div className="bg-(--color-surface) border border-(--color-border) rounded-card overflow-hidden shadow-sm">
				{/* Top Cover Area */}
				<div className="h-32 bg-linear-to-r from-(--color-accent) to-(--color-accent-soft)"></div>

				<div className="px-6 sm:px-8 pb-8">
					{/* Avatar */}
					<div className="-mt-12 mb-4">
						<div className="w-24 h-24 bg-(--color-surface) border-4 border-(--color-background) rounded-full flex items-center justify-center text-3xl font-bold text-(--color-accent) shadow-sm">
							{user.name ? user.name.charAt(0).toUpperCase() : "U"}
						</div>
					</div>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
						<div>
							<h2 className="text-2xl font-bold">{user.name || "User"}</h2>
							<p className="text-(--color-foreground) opacity-70">{user.email}</p>
						</div>
						<Button variant="outline" onClick={handleLogout} className="sm:self-start">
							Log out
						</Button>
					</div>

					{/* Profile Details (Placeholder stat blocks based on current theme) */}
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-(--color-surface-muted) p-4 rounded-xl border border-(--color-border)">
							<div className="text-sm opacity-70 mb-1">Account Status</div>
							<div className="font-semibold text-green-500 flex items-center gap-2">
								<span className="w-2 h-2 rounded-full bg-green-500"></span> Active
							</div>
						</div>
						<div className="bg-(--color-surface-muted) p-4 rounded-xl border border-(--color-border)">
							<div className="text-sm opacity-70 mb-1">Role</div>
							<div className="font-semibold">Member</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
