export default function AuthLayout({ children, title, subtitle }) {
	return (
		<div className="app-bg flex flex-col md:flex-row">
			{/* Animation / Graphic column */}
			<div className="flex-1 md:flex-[0.4] bg-(--color-surface) flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-(--color-border)">
				<div className="w-full max-w-sm aspect-square bg-(--color-surface-muted) rounded-3xl flex items-center justify-center shadow-inner relative overflow-hidden">
					{/* Placeholder for Lottie Animation */}
					<div className="absolute inset-0 bg-linear-to-br from-(--color-accent-soft) to-transparent opacity-50"></div>
					<div className="text-center z-10 p-6">
						<svg
							className="mx-auto h-16 w-16 text-(--color-accent) mb-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<title>StatHub</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M13 10V3L4 14h7v7l9-11h-7z"
							/>
						</svg>
						<p className="text-(--color-foreground) font-medium opacity-70">
							Lottie Animation Placeholder
						</p>
					</div>
				</div>
			</div>

			{/* Form column */}
			<div className="flex-1 md:flex-[0.6] flex items-center justify-center p-6 sm:p-12">
				<div className="w-full max-w-md">
					<div className="mb-8">
						<h1 className="text-3xl font-bold mb-2 text-(--color-foreground)">{title}</h1>
						{subtitle && <p className="text-(--color-foreground) opacity-70">{subtitle}</p>}
					</div>
					<div className="bg-(--color-surface) p-6 sm:p-8 rounded-card shadow-sm border border-(--color-border)">
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
