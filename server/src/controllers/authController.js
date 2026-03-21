import bcrypt from "bcryptjs";
import { and, eq, sql } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";
import { CONFIG } from "../config/config.js";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { generateToken } from "../utils/jwt.js";
import { logError } from "../utils/utils.js";
import { loginSchema, signupSchema } from "../validation/auth.js";

const resend = new Resend(CONFIG.RESEND_API_KEY);

const SALT_ROUNDS = 12;

export const signup = async (req, res) => {
	try {
		const parsedSignupSchema = await signupSchema.safeParseAsync(req.body);

		if (!parsedSignupSchema.success) {
			return res.status(400).json({ error: parsedSignupSchema.error.issues });
		}
		const { name, email, password } = parsedSignupSchema.data;

		// check duplicate email
		const existing = await db.select().from(users).where(eq(users.email, email));

		if (existing.length > 0) {
			return res.status(409).json({ error: "Email already registered" });
		}

		// hash password
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		// insert user
		const inserted = await db
			.insert(users)
			.values({
				name,
				email,
				password: hashedPassword,
			})
			.returning();

		const newUser = inserted[0];

		// generate JWT
		const token = generateToken({
			id: newUser.id,
			role: newUser.role,
		});

		return res.status(201).json({
			user: {
				id: newUser.id,
				name: newUser.name,
				email: newUser.email,
				role: newUser.role,
			},
			token,
		});
	} catch (error) {
		logError(error);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

export const login = async (req, res) => {
	try {
		const parsedLoginSchema = await loginSchema.safeParseAsync(req.body);
		if (!parsedLoginSchema.success) {
			return res.status(400).json({ error: parsedLoginSchema.error.issues });
		}

		const { email, password } = parsedLoginSchema.data;

		const found = await db
			.select()
			.from(users)
			.where(and(eq(users.email, email), eq(users.isDeleted, false)));

		if (found.length === 0) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const user = found[0];

		if (!user.password) {
			return res
				.status(400)
				.json({ error: "Please login using Google or reset your password to create one." });
		}

		const isMatch = await bcrypt.compare(password, user.password);

		if (!isMatch) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const token = generateToken({
			id: user.id,
			role: user.role,
		});

		return res.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
			},
			token,
		});
	} catch (error) {
		logError("LOGIN CONTROLLER", error);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

export const googleAuth = async (req, res) => {
	try {
		const { code } = req.body;
		if (!code) {
			return res.status(400).json({ error: "Authorization code is missing" });
		}

		const client = new OAuth2Client(
			CONFIG.GOOGLE_CLIENT_ID,
			CONFIG.GOOGLE_CLIENT_SECRET,
			"postmessage",
		);

		const { tokens } = await client.getToken(code);

		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token,
			audience: CONFIG.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();
		if (!payload) {
			return res.status(400).json({ error: "Invalid Google Token" });
		}

		const { sub: googleId, email, name, picture: avatar } = payload;

		// Check if user already exists
		const existingUsers = await db.select().from(users).where(eq(users.email, email));

		let user;

		if (existingUsers.length > 0) {
			user = existingUsers[0];

			// If missing googleId or avatar, link them
			if (!user.googleId || !user.avatar) {
				const updated = await db
					.update(users)
					.set({
						googleId: user.googleId || googleId,
						avatar: user.avatar || avatar,
					})
					.where(eq(users.id, user.id))
					.returning();
				user = updated[0];
			}
		} else {
			// Create new user (password is null)
			const inserted = await db
				.insert(users)
				.values({
					name,
					email,
					googleId,
					avatar,
				})
				.returning();
			user = inserted[0];
		}

		const token = generateToken({
			id: user.id,
			role: user.role,
		});

		return res.json({
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
			},
			token,
		});
	} catch (error) {
		logError("GOOGLE AUTH CONTROLLER", error);
		return res.status(500).json({ error: "Google authentication failed" });
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email } = req.body;
		if (!email) {
			return res.status(400).json({ error: "Email is required" });
		}

		const existingUsers = await db.select().from(users).where(eq(users.email, email));
		if (existingUsers.length === 0) {
			// Returning 404
			return res.status(404).json({ error: "User not found" });
		}
		const user = existingUsers[0];

		const token = uuidv4();
		const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

		const updatedMetadata = {
			...user.metadata,
			resetPasswordToken: token,
			resetPasswordExpires: expiresAt.toISOString(),
		};

		const _updated = await db
			.update(users)
			.set({ metadata: updatedMetadata })
			.where(eq(users.id, user.id))
			.returning();

		// Send Email
		const { error } = await resend.emails.send({
			from: "StatHub <auth@stathub.yeeshu.dev>",
			to: user.email,
			subject: "Reset Your Password - StatHub",
			html: `<p>Click the link below to reset your password:</p><p><a href="${CONFIG.CLIENT_PASSWORD_RESET_URL}?token=${token}">Reset Password</a></p><p>This link will expire in 1 hour.</p>`,
		});

		if (error) {
			logError("FAILED TO SEND RESET EMAIL", error);
			return res.status(500).json({ error: "Failed to send reset email" });
		}

		return res.status(200).json({ message: "Password reset instructions sent to your email" });
	} catch (error) {
		logError("FORGOT PASSWORD CONTROLLER", error);
		return res.status(500).json({ error: "Something went wrong" });
	}
};

export const resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;
		if (!token || !newPassword) {
			return res.status(400).json({ error: "Token and new password are required" });
		}

		// Query the user checking the JSON extraction
		const foundUsers = await db
			.select()
			.from(users)
			.where(sql`${users.metadata}->>'resetPasswordToken' = ${token}`);

		if (foundUsers.length === 0) {
			return res.status(400).json({ error: "Invalid or missing token" });
		}

		const user = foundUsers[0];

		if (
			!user.metadata.resetPasswordExpires ||
			new Date() > new Date(user.metadata.resetPasswordExpires)
		) {
			return res.status(400).json({ error: "Token has expired" });
		}

		// Hash the new password
		const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

		// Update user, clearing only resetPasswordToken and expires
		const updatedMetadata = { ...user.metadata };
		delete updatedMetadata.resetPasswordToken;
		delete updatedMetadata.resetPasswordExpires;

		await db
			.update(users)
			.set({
				password: hashedPassword,
				metadata: updatedMetadata,
			})
			.where(eq(users.id, user.id));

		return res.status(200).json({ message: "Password has been successfully reset" });
	} catch (error) {
		logError("RESET PASSWORD CONTROLLER", error);
		return res.status(500).json({ error: "Something went wrong" });
	}
};
