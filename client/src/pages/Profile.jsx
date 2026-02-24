export default function Profile() {
	const toggleTheme = () => {
		if (localStorage.theme === "dark") {
			localStorage.theme = "light";
			document.documentElement.classList.remove("dark");
		} else {
			localStorage.theme = "dark";
			document.documentElement.classList.add("dark");
		}
	};
	return (
		<div className="prose max-w-none">
			<h1>Profile</h1>
			<p>User profile page content.</p>
			<button
				type="button"
				className="bg-accent cursor-pointer p-4 m-4 rounded-2xl "
				onClick={toggleTheme}
			>
				Toggle Theme
			</button>
		</div>
	);
}
