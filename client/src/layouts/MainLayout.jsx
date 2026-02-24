import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import MenuBar from "../components/MenuBar";

export default function MainLayout() {
	return (
		<div className="min-h-screen app-bg flex flex-col">
			{/* Header fixed at top */}
			<Header />

			{/* Main content area - give top and bottom padding to avoid overlap */}
			<main className="flex-1 layout-content container mx-auto px-4">
				<Outlet />
			</main>

			{/* Menu fixed at bottom */}
			<MenuBar />
		</div>
	);
}
