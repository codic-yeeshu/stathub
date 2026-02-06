import 'dotenv/config';
import express from 'express';
import { matchesRouter } from './routes/matches.js';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// Routes
app.use('/matches', matchesRouter);

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${server.address().port}`);
});
