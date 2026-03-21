import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	const initAuth = useCallback(() => {
		const token = localStorage.getItem("token");
		const storedUser = localStorage.getItem("user");

		if (token && storedUser) {
			try {
				setUser(JSON.parse(storedUser));
			} catch (e) {
				console.error("Failed to parse user data", e);
				localStorage.removeItem("token");
				localStorage.removeItem("user");
				setUser(null);
			}
		} else {
			setUser(null);
		}
		setIsLoading(false);
	}, []);

	useEffect(() => {
		initAuth();
	}, [initAuth]);

	const login = (userData, token) => {
		localStorage.setItem("user", JSON.stringify(userData));
		localStorage.setItem("token", token);
		setUser(userData);
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
	};

	const getToken = () => {
		return localStorage.getItem("token");
	};

	const value = {
		user,
		setUser,
		isLoading,
		login,
		logout,
		getToken,
		initAuth,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
