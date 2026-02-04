import express from 'express';

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
