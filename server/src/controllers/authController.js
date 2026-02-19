import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { users } from "../db/schema.js";
import { generateToken } from "../utils/jwt.js";
import { logError } from "../utils/utils.js";
import { loginSchema, signupSchema } from "../validation/auth.js";

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

		const found = await db.select().from(users).where(eq(users.email, email));

		if (found.length === 0) {
			return res.status(401).json({ error: "Invalid credentials" });
		}

		const user = found[0];

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
