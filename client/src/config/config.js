export const CONFIG = {
	GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
	API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
	ENDPOINTS: {
		AUTH: {
			LOGIN: "/api/auth/login",
			SIGNUP: "/api/auth/signup",
			GOOGLE: "/api/auth/google",
			FORGOT_PASSWORD: "/api/auth/forgot-password",
			RESET_PASSWORD: "/api/auth/reset-password",
		},
	},
};
