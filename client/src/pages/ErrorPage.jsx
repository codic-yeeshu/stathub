import { Link } from "react-router-dom";

export default function ErrorPage() {
	return (
		<div className="flex flex-col items-center justify-center text-center h-full">
			<h1 className="text-5xl font-bold text-accent">404</h1>

			<p className="mt-4 text-lg">Page not found</p>

			<Link
				to="/"
				className="mt-6 px-6 py-2 rounded-md bg-accent text-white hover:opacity-90 transition"
			>
				Go Home
			</Link>
		</div>
	);
}
