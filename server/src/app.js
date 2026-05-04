import cors from "cors";
import express from "express";
import { securityMiddleware } from "./arcjet.js";
import { CONFIG } from "./config/config.js";
import { authRouter } from "./routes/authRoutes.js";
import { commentaryRouter } from "./routes/commentary.js";
import { matchesRouter } from "./routes/matches.js";

export function createApp() {
	const app = express();

	app.use(express.json());
	app.use(
		cors({
			origin: CONFIG.CLIENT_URL,
			credentials: true,
		}),
	);

	app.get("/", (_req, res) => {
		res.send("Server is up and running!");
	});

	// Lightweight liveness/readiness endpoint used by Docker HEALTHCHECK
	// and Kubernetes probes. Must not depend on external services.
	app.get("/health", (_req, res) => {
		res.status(200).json({ status: "ok" });
	});

	app.use(securityMiddleware());

	app.use("/matches", matchesRouter);
	app.use("/matches/:id/commentary", commentaryRouter);
	app.use("/api/auth", authRouter);

	return app;
}
