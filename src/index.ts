import express from 'express';
import cors from 'cors';
import { router } from './config/api';
import { errorHandler } from '../middleware/errorHandler';
import { rateLimit } from 'express-rate-limit';

const app = express();

app.use(cors());
app.use(express.json());

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));

app.use('/api', router);
app.use(errorHandler);

export default app; 