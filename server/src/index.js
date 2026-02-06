import 'dotenv/config';
import http from 'http'
import express from 'express';

import { matchesRouter } from './routes/matches.js';
import { attachWebSocketServer } from './ws/server.js';
import { logIt } from './utils/utils.js';

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || '0.0.0.0'

const app = express();
const server = http.createServer(app);
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Routes
app.use('/matches', matchesRouter);


const { broadcastMatchCreated } = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated

server.listen(PORT, () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`
  logIt(`Server is running at ${baseUrl}`);
  logIt(`WebSocket server is running at ${baseUrl.replace('http', 'ws')}/ws`)
});
