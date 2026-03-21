import { Router } from "express";
import {
	forgotPassword,
	googleAuth,
	login,
	resetPassword,
	signup,
} from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/google", googleAuth);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);
