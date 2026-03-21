import axios from "axios";
import { CONFIG } from "../config/config.js";

const authApi = axios.create({
	baseURL: CONFIG.API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

const handleApiError = (error, defaultMessage) => {
	if (error.response?.data) {
		throw new Error(error.response.data.message || error.response.data.error || defaultMessage);
	}
	throw error;
};

export const loginUser = async (credentials) => {
	try {
		const response = await authApi.post(CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
		return response.data;
	} catch (error) {
		handleApiError(error, "Login failed");
	}
};

export const signupUser = async (userData) => {
	try {
		const response = await authApi.post(CONFIG.ENDPOINTS.AUTH.SIGNUP, userData);
		return response.data;
	} catch (error) {
		handleApiError(error, "Signup failed");
	}
};

export const googleAuthUser = async (code) => {
	try {
		const response = await authApi.post(CONFIG.ENDPOINTS.AUTH.GOOGLE, { code });
		return response.data;
	} catch (error) {
		handleApiError(error, "Google Authentication failed");
	}
};

export const forgotPasswordUser = async (email) => {
	try {
		const response = await authApi.post(CONFIG.ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
		return response.data;
	} catch (error) {
		handleApiError(error, "Failed to send reset email");
	}
};

export const resetPasswordUser = async (token, newPassword) => {
	try {
		const response = await authApi.post(CONFIG.ENDPOINTS.AUTH.RESET_PASSWORD, {
			token,
			newPassword,
		});
		return response.data;
	} catch (error) {
		handleApiError(error, "Failed to reset password");
	}
};
