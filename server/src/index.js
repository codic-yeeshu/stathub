import "dotenv/config";
import http from "node:http";
import { createApp } from "./app.js";
import { CONFIG } from "./config/config.js";
import { logIt } from "./utils/utils.js";
import { attachWebSocketServer } from "./ws/server.js";

const PORT = Number(CONFIG.PORT);
const HOST = CONFIG.HOST;

const app = createApp();
const server = http.createServer(app);

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT, HOST, () => {
	const baseUrl = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
	logIt(`Server is running at ${baseUrl}`);
	logIt(`WebSocket server is running at ${baseUrl.replace("http", "ws")}/ws`);
});
