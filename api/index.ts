import express from 'express';
import cors from 'cors';
import { router as portsRouter } from '../src/routes/ports';

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use('/api/ports', portsRouter);

// Test endpoint
app.get('/api/test', (_, res) => {
  res.json({ status: 'ok' });
});

// Export for Vercel
export default app; 