import { z } from "zod";

export const signupSchema = z.object({
	name: z.string().min(2, "name too short").max(100),
	email: z.email("invalid email"),
	password: z
		.string()
		.min(8, "password must be at least 8 characters")
		.max(15, "password must be at most 15 characters"),
});

export const loginSchema = z.object({
	email: z.email("invalid email"),
	password: z.string().min(1, "password required"),
});
