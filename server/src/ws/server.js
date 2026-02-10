import { WebSocket, WebSocketServer } from "ws";
import { wsSecurityMiddleware } from "../arcjet.js";
import { logError, logIt, logWarn } from "../utils/utils.js";

function sendJson(socket, payload) {
	if (socket.readyState !== WebSocket.OPEN) return;

	socket.send(JSON.stringify(payload));
}

function broadcast(wss, payload) {
	for (const client of wss.clients) {
		if (client.readyState !== WebSocket.OPEN) continue;

		client.send(JSON.stringify(payload));
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
			const isSecure =
				req.socket.encrypted || req.headers["x-forwarded-proto"] === "https";
			const protocol = isSecure ? "https" : "http";

			const { pathname } = new URL(
				req.url,
				`${protocol}://${req.headers.host}`,
			);

			if (
				pathname !== "/ws" ||
				req.headers.upgrade?.toLowerCase() !== "websocket"
			) {
				socket.destroy();
				return;
			}

			const { success, code, reason } = (await wsSecurityMiddleware(req)) || {};

			if (!success) {
				logWarn(
					"Socket stayed open too long after rejection. Force killing.",
					code,
					reason,
				);
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

		sendJson(socket, { type: "welcome" });

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
		broadcast(wss, { type: "match_created", data: match });
	}

	return { broadcastMatchCreated };
}
