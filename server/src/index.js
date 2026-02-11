import "dotenv/config";
import http from "node:http";
import express from "express";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";
import { matchesRouter } from "./routes/matches.js";
import { logIt } from "./utils/utils.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
const server = http.createServer(app);
app.use(express.json());

app.get("/", (_req, res) => {
	res.send("Server is up and running!");
});

// arcjet security middleware to protect the api endpoints
app.use(securityMiddleware());

// Routes
app.use("/matches", matchesRouter);
app.use("/matches/:id/commentary", commentaryRouter);

// attach the websocket server with the express app
const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
	const baseUrl = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
	logIt(`Server is running at ${baseUrl}`);
	logIt(`WebSocket server is running at ${baseUrl.replace("http", "ws")}/ws`);
});
