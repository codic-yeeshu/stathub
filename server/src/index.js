import "dotenv/config";
import http from "node:http";
import cors from "cors";
import express from "express";
import { securityMiddleware } from "./arcjet.js";
import { CONFIG } from "./config/config.js";
import { authRouter } from "./routes/authRoutes.js";
import { commentaryRouter } from "./routes/commentary.js";
import { matchesRouter } from "./routes/matches.js";
import { logIt } from "./utils/utils.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(CONFIG.PORT);
const HOST = CONFIG.HOST;

const app = express();
const server = http.createServer(app);
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

// arcjet security middleware to protect the api endpoints
app.use(securityMiddleware());

// Routes
app.use("/matches", matchesRouter);
app.use("/matches/:id/commentary", commentaryRouter);
app.use("/api/auth", authRouter);

// attach the websocket server with the express app
const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
	const baseUrl = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
	logIt(`Server is running at ${baseUrl}`);
	logIt(`WebSocket server is running at ${baseUrl.replace("http", "ws")}/ws`);
});
