import express from 'express';
import cors from 'cors';
import { router as portsRouter } from './routes/ports';

const app = express();

app.use(cors());
app.use(express.json());

// Mount the router at /api/ports
app.use('/api/ports', portsRouter);

// Add a test endpoint
app.get('/api/test', (req, res) => {
  res.json({ status: 'ok' });
});

export { app }; 