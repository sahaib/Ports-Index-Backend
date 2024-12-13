import express from 'express';
import { router } from './routes/ports';
import cors from 'cors';

const app = express();

// Enable CORS for development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Register the routes
app.use('/api/ports', router);

export { app }; 