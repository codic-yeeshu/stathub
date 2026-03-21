import ThemeToggle from "./ThemeToggle";

/* Simple Header with left text and right search icon */
export default function Header() {
	return (
		<header className="fixed top-0 left-0 right-0 h-16 bg-(--color-surface) border-b border-(--color-border) flex items-center px-4 z-30">
			<div className="flex items-center justify-between w-full max-w-4xl mx-auto">
				<div className="text-lg font-semibold">StatHub</div>

				<div className="flex items-center gap-4">
					<ThemeToggle />
					<button
						type="button"
						aria-label="Search"
						className="p-2 rounded-md hover:bg-(--color-surface-muted)"
					>
						{/* simple search icon */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
							aria-hidden="true"
							focusable="false"
						>
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
							<circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
						</svg>
					</button>
				</div>
			</div>
		</header>
	);
}
