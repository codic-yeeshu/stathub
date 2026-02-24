import { NavLink } from "react-router-dom";

/* Simple bottom menu bar with 4 items */
const items = [
	{ to: "/", label: "Home", exact: true },
	{ to: "/quickview", label: "Quick View" },
	{ to: "/create", label: "Host" }, // you said host; using label Host but route is create
	{ to: "/profile", label: "Profile" },
];

export default function MenuBar() {
	return (
		<nav className="fixed bottom-0 left-0 right-0 h-16 bg-(--color-surface) border-t border-(--color-border) z-30">
			<div className="max-w-4xl mx-auto h-full flex items-center justify-between px-4">
				{items.map((it) => (
					<NavLink
						key={it.to}
						to={it.to}
						end={it.exact}
						className={({ isActive }) =>
							`flex-1 text-center py-2 px-2 rounded-md mx-1 transition-colors text-sm ${
								isActive ? "nav-active" : "hover:bg-(--color-surface-muted)"
							}`
						}
					>
						<div className="truncate">{it.label}</div>
					</NavLink>
				))}
			</div>
		</nav>
	);
}
