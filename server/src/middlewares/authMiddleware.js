import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = verifyToken(token);
		req.user = decoded;
		next();
	} catch (_err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
