import { WebSocket, WebSocketServer } from "ws";
import { wsSecurityMiddleware } from "../arcjet.js";
import { logError, logIt, logWarn } from "../utils/utils.js";

const matchSubscribers = new Map();

function subscribe(matchId, socket) {
	if (!matchSubscribers.has(matchId)) {
		matchSubscribers.set(matchId, new Set());
	}

	matchSubscribers.get(matchId).add(socket);
}

function unsubscribe(matchId, socket) {
	const subscribers = matchSubscribers.get(matchId);

	if (!subscribers) return;

	subscribers.delete(socket);

	if (subscribers.size === 0) {
		matchSubscribers.delete(matchId);
	}
}

function cleanupSubscriptions(socket) {
	for (const matchId of socket.subscriptions) {
		unsubscribe(matchId, socket);
	}
}

function sendJson(socket, payload) {
	if (socket.readyState !== WebSocket.OPEN) return;

	socket.send(JSON.stringify(payload));
}

function broadcastToAll(wss, payload) {
	for (const client of wss.clients) {
		if (client.readyState !== WebSocket.OPEN) continue;

		client.send(JSON.stringify(payload));
	}
}

function broadcastToMatch(matchId, payload) {
	const subscribers = matchSubscribers.get(matchId);
	if (!subscribers || subscribers.size === 0) return;

	const message = JSON.stringify(payload);

	for (const client of subscribers) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(message);
		}
	}
}

function handleMessage(socket, data) {
	let message;

	try {
		message = JSON.parse(data.toString());
	} catch {
		sendJson(socket, { type: "error", message: "Invalid JSON" });
	}

	if (message?.type === "subscribe" && Number.isInteger(message.matchId)) {
		subscribe(message.matchId, socket);
		socket.subscriptions.add(message.matchId);
		sendJson(socket, { type: "subscribed", matchId: message.matchId });
		return;
	}

	if (message?.type === "unsubscribe" && Number.isInteger(message.matchId)) {
		unsubscribe(message.matchId, socket);
		socket.subscriptions.delete(message.matchId);
		sendJson(socket, { type: "unsubscribed", matchId: message.matchId });
	}
}

export function attachWebSocketServer(server) {
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: 1024 * 1024,
	});

	server.on("upgrade", async (req, socket, head) => {
		try {
			logIt(`Received upgrade request.`);
			const isSecure = req.socket.encrypted || req.headers["x-forwarded-proto"] === "https";
			const protocol = isSecure ? "https" : "http";

			const { pathname } = new URL(req.url, `${protocol}://${req.headers.host}`);

			if (pathname !== "/ws" || req.headers.upgrade?.toLowerCase() !== "websocket") {
				socket.destroy();
				return;
			}

			const { success, code, reason } = (await wsSecurityMiddleware(req)) || {};

			if (!success) {
				logWarn("Socket stayed open too long after rejection. Force killing.", code, reason);
				socket.destroy();
				return;
			}

			wss.handleUpgrade(req, socket, head, (ws) => {
				logIt(`Emitted connection event for wss.`);
				wss.emit("connection", ws, req);
			});
		} catch (err) {
			logError("WebSocket upgrade failed.", err);
			socket.destroy();
		}
	});

	wss.on("connection", async (socket, _req) => {
		logIt(
			`New WebSocket connection established for socket ${socket._socket.remoteAddress}:${socket._socket.remotePort}.`,
		);

		// set the current socket as alive while connecting and while receiving a pong heartbeat.
		socket.isAlive = true;
		socket.on("pong", () => {
			socket.isAlive = true;
		});

		socket.subscriptions = new Set();

		sendJson(socket, { type: "welcome" });

		socket.on("message", (data) => {
			handleMessage(socket, data);
		});

		socket.on("close", () => {
			cleanupSubscriptions(socket);
		});

		socket.on("error", () => {
			socket.terminate();
		});

		socket.on("error", logError);
	});

	const checkAliveStatus = setInterval(() => {
		wss.clients.forEach((client) => {
			if (client.isAlive === false) {
				client.terminate();
				return;
			}
			client.isAlive = false;
			client.ping();
		});
	}, 30 * 1000);

	wss.on("close", () => {
		clearInterval(checkAliveStatus);
	});

	function broadcastMatchCreated(match) {
		broadcastToAll(wss, { type: "match_created", data: match });
	}

	function broadcastCommentary(matchId, comment) {
		broadcastToMatch(matchId, { type: "commentary", data: comment });
	}

	return { broadcastMatchCreated, broadcastCommentary };
}
