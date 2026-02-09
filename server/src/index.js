import 'dotenv/config';
import http from 'http'
import express from 'express';

import { matchesRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';
import { logIt } from './utils/utils.js';
import { securityMiddleware } from './arcjet.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0'

const app = express();
const server = http.createServer(app);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// arcjet security middleware to protect the api endpoints
app.use(securityMiddleware());

// Routes
app.use('/matches', matchesRouter);

// attach the websocket server with the express app
const { broadcastMatchCreated } = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated

server.listen(PORT, HOST, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`
  logIt(`Server is running at ${baseUrl}`);
  logIt(`WebSocket server is running at ${baseUrl.replace('http', 'ws')}/ws`)
});
