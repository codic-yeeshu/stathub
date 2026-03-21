import jwt from "jsonwebtoken";
import { CONFIG } from "../config/config";

const JWT_SECRET = CONFIG.JWT_SECRET;
const JWT_EXPIRES_IN = "7d";

if (!JWT_SECRET) {
	throw new Error("JWT_SECRET environment variable is required");
}
export function generateToken(payload) {
	return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
	return jwt.verify(token, JWT_SECRET);
}
