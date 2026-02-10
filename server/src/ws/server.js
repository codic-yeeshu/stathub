import { WebSocket, WebSocketServer } from "ws";
import { wsSecurityMiddleware } from "../arcjet.js";

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
		server,
		path: "/ws",
		maxPayload: 1024 * 1024,
	});

	wss.on("connection", async (socket, req) => {
		const { success, code, reason } = (await wsSecurityMiddleware(req)) || {};
		if (!success) {
			socket.close(code, reason);
			return;
		}

		// set the current socket as alive while connecting and while receiving a pong heartbeat.
		socket.isAlive = true;
		socket.on("pong", () => {
			socket.isAlive = true;
		});

		sendJson(socket, { type: "welcome" });

		socket.on("error", console.error);
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
