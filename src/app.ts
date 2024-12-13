import express from 'express';
import cors from 'cors';
import { router as portsRouter } from './routes/ports';

const app = express();

app.use(cors());
app.use(express.json());

// Mount at /api/ports
app.use('/api/ports', portsRouter);

// Test endpoint
app.get('/api/test', (_, res) => {
  res.json({ status: 'ok' });
});

export { app }; 