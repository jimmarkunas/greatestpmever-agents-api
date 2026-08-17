import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

const app = express();
const port = Number.parseInt(process.env.PORT ?? '3001', 10);
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
  }),
);
app.use(express.json());

app.get('/', (_request, response) => {
  response.json({
    service: 'A.G.E.N.T.S. API',
    status: 'running',
  });
});

app.get('/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'greatestpmever-agents-api',
    version: '1.0.0',
  });
});

app.use((_request, response) => {
  response.status(404).json({ error: 'not_found' });
});

app.listen(port, () => {
  console.log(`A.G.E.N.T.S. API listening on port ${port}`);
});
