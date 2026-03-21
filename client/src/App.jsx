import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CONFIG } from "./config/config";
import { AuthProvider } from "./context/AuthContext";
import MainLayout from "./layouts/MainLayout";
import Create from "./pages/Create";
import ErrorPage from "./pages/ErrorPage";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import QuickView from "./pages/QuickView";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";

export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<MainLayout />}>
						{/* children routes */}
						<Route index element={<Home />} />
						<Route path="quickview" element={<QuickView />} />
						<Route path="create" element={<Create />} />
						<Route path="profile" element={<Profile />} />
						<Route
							path="login"
							element={
								<GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
									<Login />
								</GoogleOAuthProvider>
							}
						/>
						<Route
							path="signup"
							element={
								<GoogleOAuthProvider clientId={CONFIG.GOOGLE_CLIENT_ID}>
									<Signup />
								</GoogleOAuthProvider>
							}
						/>
						<Route path="forgot-password" element={<ForgotPassword />} />
						<Route path="reset-password" element={<ResetPassword />} />
						<Route path="*" element={<ErrorPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	);
}
