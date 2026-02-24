import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Create from "./pages/Create";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import QuickView from "./pages/QuickView";

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					{/* children routes */}
					<Route index element={<Home />} />
					<Route path="quickview" element={<QuickView />} />
					<Route path="create" element={<Create />} />
					<Route path="profile" element={<Profile />} />
					<Route path="*" element={<ErrorPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
