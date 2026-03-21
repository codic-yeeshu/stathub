import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [isDark, setIsDark] = useState(false);

	useEffect(() => {
		// Initialize state based on the document class that was set by index.html script
		setIsDark(document.documentElement.classList.contains("dark"));
	}, []);

	const toggleTheme = () => {
		const newIsDark = !isDark;
		setIsDark(newIsDark);
		if (newIsDark) {
			document.documentElement.classList.add("dark");
			localStorage.theme = "dark";
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.theme = "light";
		}
	};

	return (
		<button
			type="button"
			role="switch"
			aria-checked={isDark}
			onClick={toggleTheme}
			className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:ring-offset-2 focus:ring-offset-(--color-background) bg-(--color-surface-muted) border border-(--color-border)"
		>
			<span className="sr-only">Toggle theme</span>
			<span
				className={`${
					isDark ? "translate-x-6 bg-(--color-accent)" : "translate-x-1 bg-gray-400"
				} inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out`}
			/>
		</button>
	);
}
